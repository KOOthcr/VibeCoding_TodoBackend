# CORS 문제 해결 가이드 🔧

## ✅ 해결 완료!

`strict-origin-when-cross-origin` CORS 에러가 해결되었습니다.

## 🔍 문제 원인

### CORS (Cross-Origin Resource Sharing)란?
- 브라우저 보안 정책으로, 다른 출처(origin)에서 리소스를 요청할 때 발생
- 예: `file://` 프로토콜에서 `http://localhost:5000` API 호출 시

### `strict-origin-when-cross-origin` 에러
- 브라우저가 보안상의 이유로 다른 출처의 요청을 차단
- 서버에서 명시적으로 CORS를 허용해야 함

## 🛠️ 적용된 해결 방법

### 1. **CORS 미들웨어 설정**

```javascript
const corsOptions = {
  origin: '*',  // 모든 출처 허용
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 2. **추가 CORS 헤더 설정**

```javascript
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
```

## 📋 설정 상세 설명

### `origin: '*'`
- **의미**: 모든 출처에서의 요청 허용
- **개발 환경**: 적합 ✅
- **프로덕션**: 특정 도메인으로 제한 권장

### `methods`
허용된 HTTP 메서드:
- `GET`: 데이터 조회
- `POST`: 데이터 생성
- `PUT`: 데이터 전체 수정
- `PATCH`: 데이터 부분 수정
- `DELETE`: 데이터 삭제
- `OPTIONS`: Preflight 요청

### `allowedHeaders`
허용된 요청 헤더:
- `Content-Type`: 요청 본문 타입
- `Authorization`: 인증 토큰 (향후 사용)

### `credentials: true`
- 쿠키 및 인증 정보 포함 허용

### Preflight 요청 처리
```javascript
if (req.method === 'OPTIONS') {
  return res.sendStatus(200);
}
```
- 브라우저가 실제 요청 전에 보내는 사전 확인 요청
- OPTIONS 요청에 200 응답으로 허용 표시

## 🎯 테스트 방법

### 1. 브라우저 콘솔 확인
```javascript
// 개발자 도구 (F12) > Console
fetch('http://localhost:5000/api/todos')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. 네트워크 탭 확인
- 개발자 도구 (F12) > Network
- API 요청 확인
- Response Headers에서 CORS 헤더 확인:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  ```

### 3. 실제 앱 테스트
1. `index.html` 파일을 브라우저에서 열기
2. 할일 추가 시도
3. ✅ 에러 없이 정상 작동하는지 확인

## 🚨 여전히 CORS 에러가 발생하는 경우

### 1. 서버 재시작 확인
```bash
# 터미널에서 확인
# nodemon이 자동으로 재시작했는지 확인
# 다음 메시지가 표시되어야 함:
# [nodemon] restarting due to changes...
# ✅ MongoDB 연결 성공!
```

### 2. 브라우저 캐시 삭제
- `Ctrl + Shift + Delete` (Windows)
- `Cmd + Shift + Delete` (Mac)
- 캐시 및 쿠키 삭제

### 3. 시크릿/프라이빗 모드에서 테스트
- `Ctrl + Shift + N` (Chrome)
- `Ctrl + Shift + P` (Firefox)

### 4. 다른 브라우저에서 테스트
- Chrome, Firefox, Edge 등

## 📝 프로덕션 환경 설정 (참고)

프로덕션 환경에서는 보안을 위해 특정 도메인만 허용:

```javascript
const corsOptions = {
  origin: 'https://yourdomain.com', // 특정 도메인만 허용
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

또는 여러 도메인 허용:

```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://app.yourdomain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

## 🔍 CORS 에러 디버깅

### 브라우저 콘솔에서 확인할 수 있는 에러 메시지:

#### 1. `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- **원인**: 서버에서 CORS 허용 안 함
- **해결**: ✅ 이미 해결됨 (위 설정 적용)

#### 2. `No 'Access-Control-Allow-Origin' header is present`
- **원인**: CORS 헤더 누락
- **해결**: ✅ 이미 해결됨 (추가 헤더 설정)

#### 3. `The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*'`
- **원인**: credentials 사용 시 wildcard 불가
- **해결**: 특정 도메인 지정 또는 credentials: false

## ✅ 현재 설정 요약

```javascript
// server.js
✅ CORS 미들웨어 설정
✅ 모든 출처 허용 (*)
✅ 모든 HTTP 메서드 허용
✅ Preflight 요청 처리
✅ 추가 CORS 헤더 설정
```

## 🎉 완료!

CORS 문제가 해결되었습니다. 이제 다음 주소에서 앱을 사용할 수 있습니다:

- **서버 주소**: http://localhost:5000
- **API 엔드포인트**: http://localhost:5000/api/todos
- **HTML 파일**: `index.html` 직접 열기 가능

---

**참고**: 개발 환경에서는 모든 출처를 허용(`*`)하지만, 프로덕션 환경에서는 보안을 위해 특정 도메인만 허용하는 것이 좋습니다.
