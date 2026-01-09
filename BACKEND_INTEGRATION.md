# 백엔드 연동 Todo List 앱 🚀

Firebase 대신 Node.js + Express + MongoDB 백엔드를 사용하는 할일 관리 앱입니다.

## ✅ 완료된 작업

### 1. **백엔드 API 연동**
- Firebase Realtime Database → **Node.js 백엔드 API**로 변경
- 모든 CRUD 작업이 `http://localhost:5000/api/todos`를 통해 처리됩니다

### 2. **구현된 기능**

#### 📝 할일 추가 (CREATE)
```javascript
POST /api/todos
{
  "task": "할일 내용",
  "date": "2026-01-08",
  "time": "14:30",
  "priority": "medium"
}
```

#### 📖 할일 조회 (READ)
```javascript
GET /api/todos
// 모든 할일을 날짜와 시간 순으로 정렬하여 반환
```

#### ✏️ 할일 수정 (UPDATE)
```javascript
PUT /api/todos/:id
{
  "task": "수정된 할일",
  "date": "2026-01-09",
  "time": "15:00"
}
```

#### 🔄 완료 상태 토글
```javascript
PATCH /api/todos/:id/toggle
// 완료 ↔ 미완료 상태 전환
```

#### 🗑️ 할일 삭제 (DELETE)
```javascript
DELETE /api/todos/:id
```

## 🎯 사용 방법

### 1. 서버 실행
```bash
cd study/todolist_backend
npm run dev
```

서버가 실행되면 다음과 같은 메시지가 표시됩니다:
```
==================================================
🚀 서버가 포트 5000번에서 실행 중입니다.
📍 서버 주소: http://localhost:5000
🔗 API 테스트: http://localhost:5000/health
==================================================
✅ MongoDB 연결 성공!
📦 데이터베이스: todolist
```

### 2. 웹 앱 열기
브라우저에서 다음 주소로 접속:
```
http://localhost:5000
```

또는 `index.html` 파일을 직접 열기

### 3. 할일 관리
- **추가**: 할일, 날짜, 시간을 입력하고 "추가" 버튼 클릭
- **수정**: 할일 항목의 "수정" 버튼 클릭 → 내용 수정 → "저장"
- **삭제**: 할일 항목의 "삭제" 버튼 클릭
- **완료 처리**: 체크박스 클릭

## 📁 파일 구조

```
todolist_backend/
├── index.html          # 프론트엔드 HTML
├── script.js           # 백엔드 API 연동 JavaScript
├── style.css           # 스타일시트
├── server.js           # Express 서버
├── routes/
│   └── todos.js        # Todo API 라우터
├── models/
│   └── Todo.js         # MongoDB 스키마
└── .env                # 환경 변수
```

## 🔧 주요 변경사항

### Before (Firebase)
```javascript
// Firebase Realtime Database 사용
import { getDatabase, ref, push, set } from "firebase/database";

const database = getDatabase(app);
const todosRef = ref(database, 'todos');
await set(push(todosRef), todoData);
```

### After (Backend API)
```javascript
// Node.js 백엔드 API 사용
const API_BASE_URL = 'http://localhost:5000/api/todos';

const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData)
});
```

## 🎨 UI 기능

### 1. **할일 추가 폼**
- 할일 내용 입력
- 날짜 선택 (기본값: 오늘)
- 시간 선택 (기본값: 현재 시간)

### 2. **할일 목록**
- 날짜와 시간 순으로 자동 정렬
- 완료된 할일은 회색으로 표시
- 각 할일마다 수정/삭제 버튼

### 3. **수정 모드**
- 인라인 편집 폼
- 할일, 날짜, 시간 모두 수정 가능
- 저장/취소 버튼

### 4. **빈 상태**
- 할일이 없을 때 안내 메시지 표시

## 🔍 API 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "할일이 성공적으로 생성되었습니다.",
  "data": {
    "_id": "695f58cfa250bd7aea3595ba",
    "task": "프로젝트 발표 준비",
    "date": "2026-01-10T00:00:00.000Z",
    "time": "14:30",
    "completed": false,
    "priority": "medium",
    "createdAt": "2026-01-08T07:12:15.901Z",
    "updatedAt": "2026-01-08T07:12:15.901Z"
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "할일을 입력해주세요."
}
```

## 🚀 데이터 흐름

```
사용자 입력
    ↓
script.js (프론트엔드)
    ↓
HTTP 요청 (fetch)
    ↓
Express 서버 (server.js)
    ↓
Todo 라우터 (routes/todos.js)
    ↓
MongoDB (데이터베이스)
    ↓
응답 반환
    ↓
UI 업데이트
```

## ✨ 주요 기능

### 자동 정렬
- 백엔드에서 날짜와 시간 순으로 정렬
- 프론트엔드에서도 추가 정렬 적용

### 실시간 업데이트
- 모든 작업 후 자동으로 목록 새로고침
- 최신 데이터 항상 표시

### 에러 처리
- 서버 연결 실패 시 사용자에게 알림
- 유효성 검사 실패 시 에러 메시지 표시

### 사용자 경험
- 폼 자동 초기화
- 추가 시 애니메이션 효과
- ESC 키로 수정 취소

## 🎯 테스트 방법

### 1. 할일 추가 테스트
1. 할일 입력: "프로젝트 발표 준비"
2. 날짜 선택: 2026-01-10
3. 시간 선택: 14:30
4. "추가" 버튼 클릭
5. ✅ 목록에 추가되는지 확인

### 2. 할일 수정 테스트
1. 할일 항목의 "수정" 버튼 클릭
2. 내용 수정
3. "저장" 버튼 클릭
4. ✅ 변경사항이 반영되는지 확인

### 3. 완료 처리 테스트
1. 체크박스 클릭
2. ✅ 할일이 회색으로 변하는지 확인
3. 다시 클릭
4. ✅ 원래대로 돌아오는지 확인

### 4. 할일 삭제 테스트
1. "삭제" 버튼 클릭
2. 확인 대화상자에서 "확인" 클릭
3. ✅ 목록에서 제거되는지 확인

## 📝 참고사항

- **서버 실행 필수**: 백엔드 서버가 실행 중이어야 앱이 작동합니다
- **MongoDB 필수**: MongoDB가 실행 중이어야 데이터가 저장됩니다
- **CORS 허용**: 서버에서 CORS가 허용되어 있어 다른 포트에서도 접근 가능
- **포트**: 서버는 5000번 포트에서 실행됩니다

## 🎉 완료!

Firebase 없이 완전히 백엔드 API를 통해 작동하는 할일 관리 앱이 완성되었습니다!

---

**서버 주소**: http://localhost:5000  
**API 엔드포인트**: http://localhost:5000/api/todos  
**데이터베이스**: MongoDB (todolist)
