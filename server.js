// 필요한 모듈 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Express 앱 생성
const app = express();

// 미들웨어 설정
// CORS 설정 - 모든 출처 허용
// CORS 설정 - React 개발 서버 허용
// CORS 설정 - 동적으로 origin 검증
const corsOptions = {
  origin: function (origin, callback) {
    // 허용할 origin 패턴들
    const allowedOrigins = [
      /^http:\/\/localhost:\d+$/,           // localhost with any port
      /^http:\/\/127\.0\.0\.1:\d+$/,        // 127.0.0.1 with any port
      /^https:\/\/.*\.vercel\.app$/         // All Vercel domains (production & preview)
    ];

    // origin이 없는 경우 (예: 모바일 앱, Postman 등) 허용
    if (!origin) {
      return callback(null, true);
    }

    // 허용된 패턴과 매칭되는지 확인
    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS 차단된 origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱
app.use(express.static('public')); // 정적 파일 제공

// 추가 CORS 헤더 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// 환경 변수에서 포트와 MongoDB URI 가져오기
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist';

// 디버그: 환경 변수 확인 (비밀번호는 마스킹)
console.log('🔍 환경 변수 확인:');
console.log(`   PORT: ${PORT}`);
console.log(`   MONGODB_URI: ${MONGODB_URI ? MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@') : '설정되지 않음'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '설정되지 않음'}`);
console.log('');

// MongoDB 연결
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공!');
    console.log(`📦 데이터베이스: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1); // 연결 실패 시 프로세스 종료
  });

// MongoDB 연결 이벤트 리스너
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB 연결이 끊어졌습니다.');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB 에러:', error);
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Todo List API 서버가 실행 중입니다!',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      health: '/health',
      todos: '/api/todos'
    }
  });
});

// 헬스 체크 라우트
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ==================== API 라우트 ====================
// Todo 라우터 불러오기
const todoRoutes = require('./routes/todos');

// Todo 라우터 연결
app.use('/api/todos', todoRoutes);


// 서버 시작
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 서버가 포트 ${PORT}번에서 실행 중입니다.`);
  console.log(`📍 서버 주소: http://localhost:${PORT}`);
  console.log(`🔗 API 테스트: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('서버를 종료하려면 Ctrl+C를 누르세요.');
});

// 프로세스 종료 시 MongoDB 연결 종료
process.on('SIGINT', async () => {
  console.log('\n⚠️ 서버를 종료합니다...');
  await mongoose.connection.close();
  console.log('✅ MongoDB 연결이 종료되었습니다.');
  process.exit(0);
});
