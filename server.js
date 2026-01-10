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
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://todolist-frontend-ten.vercel.app' // Vercel 배포 프론트엔드 허용
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // credentials를 false로 설정 (origin: '*' 대신 특정 origin 사용)
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
