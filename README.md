# Todo List Backend Server 🚀

Express.js와 MongoDB를 사용한 Todo List 백엔드 서버입니다.

## 📋 설치된 패키지

- **express**: 웹 서버 프레임워크
- **mongoose**: MongoDB ODM (Object Data Modeling)
- **dotenv**: 환경 변수 관리
- **cors**: Cross-Origin Resource Sharing 허용
- **nodemon**: 개발 시 자동 재시작 (dev dependency)

## 📁 프로젝트 구조

```
todolist_backend/
├── models/              # 데이터베이스 모델
│   └── Todo.js         # Todo 스키마 정의
├── routes/             # API 라우터
│   └── todos.js        # Todo CRUD API
├── .env                # 환경 변수 (MongoDB URI, PORT 등)
├── .gitignore          # Git 제외 파일 목록
├── server.js           # 메인 서버 파일
├── package.json        # 프로젝트 설정 및 의존성
├── API.md              # API 문서
├── SCHEMA.md           # 데이터베이스 스키마 문서
├── test-api.js         # API 테스트 스크립트
├── test-schema.js      # 스키마 테스트 스크립트
└── README.md           # 이 파일
```

## 🚀 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 확인하고 필요시 수정하세요:
```env
MONGODB_URI=mongodb://localhost:27017/todolist
PORT=5000
```

### 3. MongoDB 실행
로컬 MongoDB를 사용하는 경우, MongoDB가 실행 중인지 확인하세요:
```bash
# Windows에서 MongoDB 서비스 확인
net start MongoDB

# 또는 MongoDB Compass를 사용하여 연결 확인
```

**MongoDB Atlas 사용 시:**
`.env` 파일에서 MongoDB Atlas URI로 변경하세요:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
```

### 4. 서버 실행

**개발 모드 (nodemon - 자동 재시작):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

## 📡 API 엔드포인트

### 기본 정보
- **GET** `/` - 서버 상태 및 API 정보
- **GET** `/health` - 헬스 체크 (서버 및 DB 상태)

### Todo API
- **POST** `/api/todos` - 할일 생성
- **GET** `/api/todos` - 모든 할일 조회 (필터링 가능)
- **GET** `/api/todos/:id` - 특정 할일 조회
- **PUT** `/api/todos/:id` - 할일 수정
- **PATCH** `/api/todos/:id/toggle` - 완료 상태 토글
- **DELETE** `/api/todos/:id` - 할일 삭제
- **DELETE** `/api/todos` - 모든 할일 삭제 (개발용)

자세한 API 문서는 [`API.md`](./API.md)를 참고하세요.

## 🧪 테스트

### API 테스트
```bash
node test-api.js
```

모든 API 엔드포인트를 자동으로 테스트합니다:
- ✅ 할일 생성
- ✅ 할일 조회 (전체, 개별, 필터링)
- ✅ 할일 수정
- ✅ 완료 상태 토글
- ✅ 할일 삭제
- ✅ 유효성 검사

### 스키마 테스트
```bash
node test-schema.js
```

MongoDB 스키마와 CRUD 작업을 테스트합니다.

## 🎯 서버 실행 확인

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
==================================================
🚀 서버가 포트 5000번에서 실행 중입니다.
📍 서버 주소: http://localhost:5000
🔗 API 테스트: http://localhost:5000/health
==================================================
서버를 종료하려면 Ctrl+C를 누르세요.
✅ MongoDB 연결 성공!
📦 데이터베이스: todolist
```

### 브라우저에서 테스트
- **메인**: http://localhost:5000
- **헬스 체크**: http://localhost:5000/health

## 📊 데이터베이스 스키마

### Todo 모델

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `task` | String | ✅ | 할일 내용 (1-500자) |
| `date` | Date | ✅ | 날짜 |
| `time` | String | ✅ | 시간 (HH:MM 형식) |
| `completed` | Boolean | ❌ | 완료 여부 (기본값: false) |
| `priority` | String | ❌ | 우선순위 (low/medium/high) |
| `createdAt` | Date | 자동 | 생성 일시 |
| `updatedAt` | Date | 자동 | 수정 일시 |

자세한 스키마 문서는 [`SCHEMA.md`](./SCHEMA.md)를 참고하세요.

## 🔧 주요 기능

### MongoDB 연결 관리
- 자동 연결 및 재연결
- 연결 상태 모니터링
- 에러 핸들링
- Graceful shutdown (서버 종료 시 DB 연결 정리)

### 미들웨어
- **CORS**: 모든 도메인에서 API 접근 허용
- **JSON 파싱**: JSON 요청 본문 자동 파싱
- **URL 인코딩**: URL 인코딩된 데이터 파싱

### API 기능
- ✅ 완전한 CRUD 작업
- ✅ 필터링 (완료 여부, 우선순위, 날짜)
- ✅ 유효성 검사
- ✅ 에러 핸들링
- ✅ 정렬 (날짜, 시간 순)

## 💡 사용 예시

### JavaScript (Fetch API)

```javascript
// 할일 생성
const response = await fetch('http://localhost:5000/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: '프로젝트 발표 준비하기',
    date: '2026-01-10',
    time: '14:30',
    priority: 'high'
  })
});

// 모든 할일 조회
const todos = await fetch('http://localhost:5000/api/todos');
const data = await todos.json();

// 완료 상태 토글
await fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
  method: 'PATCH'
});
```

## 🐛 문제 해결

### MongoDB 연결 실패
```
❌ MongoDB 연결 실패: connect ECONNREFUSED 127.0.0.1:27017
```
**해결 방법:**
1. MongoDB가 실행 중인지 확인
2. `.env` 파일의 `MONGODB_URI` 확인
3. MongoDB Atlas 사용 시 네트워크 접근 허용 확인

### 포트 이미 사용 중
```
Error: listen EADDRINUSE: address already in use :::5000
```
**해결 방법:**
1. 다른 포트 사용 (`.env`에서 `PORT` 변경)
2. 또는 해당 포트를 사용 중인 프로세스 종료

## 📝 환경 변수 설명

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `MONGODB_URI` | MongoDB 연결 URI | `mongodb://localhost:27017/todolist` |
| `PORT` | 서버 포트 번호 | `5000` |

## 🎓 참고 자료

- [Express.js 공식 문서](https://expressjs.com/)
- [Mongoose 공식 문서](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [`API.md`](./API.md) - 상세 API 문서
- [`SCHEMA.md`](./SCHEMA.md) - 데이터베이스 스키마 문서

---

**만든 날짜**: 2026-01-08  
**서버 포트**: 5000  
**데이터베이스**: MongoDB  
**API 버전**: 1.0.0

