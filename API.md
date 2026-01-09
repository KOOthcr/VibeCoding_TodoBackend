# Todo API 문서 📚

Todo List 백엔드 API 사용 가이드입니다.

## 🌐 Base URL

```
http://localhost:5000
```

## 📋 API 엔드포인트

### 1. 할일 생성 (CREATE)

**POST** `/api/todos`

새로운 할일을 생성합니다.

#### 요청 본문 (Request Body)

```json
{
  "task": "프로젝트 발표 준비하기",
  "date": "2026-01-10",
  "time": "14:30",
  "priority": "high"
}
```

| 필드 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `task` | String | ✅ | 할일 내용 (1-500자) | `"프로젝트 발표 준비하기"` |
| `date` | String | ✅ | 날짜 (YYYY-MM-DD) | `"2026-01-10"` |
| `time` | String | ✅ | 시간 (HH:MM) | `"14:30"` |
| `priority` | String | ❌ | 우선순위 (low/medium/high) | `"high"` |

#### 성공 응답 (201 Created)

```json
{
  "success": true,
  "message": "할일이 성공적으로 생성되었습니다.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "task": "프로젝트 발표 준비하기",
    "date": "2026-01-10T00:00:00.000Z",
    "time": "14:30",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-01-08T07:05:20.873Z",
    "updatedAt": "2026-01-08T07:05:20.873Z"
  }
}
```

#### 에러 응답 (400 Bad Request)

```json
{
  "success": false,
  "message": "할일을 입력해주세요."
}
```

#### cURL 예시

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "task": "프로젝트 발표 준비하기",
    "date": "2026-01-10",
    "time": "14:30",
    "priority": "high"
  }'
```

---

### 2. 모든 할일 조회 (READ ALL)

**GET** `/api/todos`

모든 할일을 조회합니다. 쿼리 파라미터로 필터링 가능합니다.

#### 쿼리 파라미터 (선택 사항)

| 파라미터 | 타입 | 설명 | 예시 |
|----------|------|------|------|
| `completed` | Boolean | 완료 여부 필터 | `true` 또는 `false` |
| `priority` | String | 우선순위 필터 | `low`, `medium`, `high` |
| `date` | String | 특정 날짜 필터 | `2026-01-08` |

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "task": "MongoDB 공부하기",
      "date": "2026-01-08T00:00:00.000Z",
      "time": "10:00",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-01-08T07:05:20.873Z",
      "updatedAt": "2026-01-08T07:05:20.873Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "task": "운동하기",
      "date": "2026-01-08T00:00:00.000Z",
      "time": "18:00",
      "completed": false,
      "priority": "low",
      "createdAt": "2026-01-08T07:05:20.873Z",
      "updatedAt": "2026-01-08T07:05:20.873Z"
    }
  ]
}
```

#### cURL 예시

```bash
# 모든 할일 조회
curl http://localhost:5000/api/todos

# 미완료 할일만 조회
curl http://localhost:5000/api/todos?completed=false

# 특정 날짜의 할일 조회
curl http://localhost:5000/api/todos?date=2026-01-08

# 높은 우선순위 할일 조회
curl http://localhost:5000/api/todos?priority=high
```

---

### 3. 특정 할일 조회 (READ ONE)

**GET** `/api/todos/:id`

특정 ID의 할일을 조회합니다.

#### URL 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | String | Todo ID |

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "task": "프로젝트 발표 준비하기",
    "date": "2026-01-10T00:00:00.000Z",
    "time": "14:30",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-01-08T07:05:20.873Z",
    "updatedAt": "2026-01-08T07:05:20.873Z"
  }
}
```

#### 에러 응답 (404 Not Found)

```json
{
  "success": false,
  "message": "할일을 찾을 수 없습니다."
}
```

#### cURL 예시

```bash
curl http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

---

### 4. 할일 수정 (UPDATE)

**PUT** `/api/todos/:id`

특정 할일을 수정합니다.

#### URL 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | String | Todo ID |

#### 요청 본문 (Request Body)

```json
{
  "task": "프로젝트 발표 준비 완료하기",
  "time": "15:00",
  "priority": "high",
  "completed": true
}
```

모든 필드는 선택 사항입니다. 수정하고 싶은 필드만 포함하세요.

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "message": "할일이 성공적으로 수정되었습니다.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "task": "프로젝트 발표 준비 완료하기",
    "date": "2026-01-10T00:00:00.000Z",
    "time": "15:00",
    "completed": true,
    "priority": "high",
    "createdAt": "2026-01-08T07:05:20.873Z",
    "updatedAt": "2026-01-08T08:10:30.123Z"
  }
}
```

#### cURL 예시

```bash
curl -X PUT http://localhost:5000/api/todos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "task": "프로젝트 발표 준비 완료하기",
    "completed": true
  }'
```

---

### 5. 완료 상태 토글 (TOGGLE)

**PATCH** `/api/todos/:id/toggle`

할일의 완료 상태를 토글합니다 (완료 ↔ 미완료).

#### URL 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | String | Todo ID |

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "message": "할일이 완료 처리되었습니다.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "task": "프로젝트 발표 준비하기",
    "completed": true,
    "...": "..."
  }
}
```

#### cURL 예시

```bash
curl -X PATCH http://localhost:5000/api/todos/507f1f77bcf86cd799439011/toggle
```

---

### 6. 할일 삭제 (DELETE)

**DELETE** `/api/todos/:id`

특정 할일을 삭제합니다.

#### URL 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | String | Todo ID |

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "message": "할일이 성공적으로 삭제되었습니다.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "task": "프로젝트 발표 준비하기",
    "...": "..."
  }
}
```

#### cURL 예시

```bash
curl -X DELETE http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

---

### 7. 모든 할일 삭제 (DELETE ALL) - 개발용

**DELETE** `/api/todos`

⚠️ **주의**: 모든 할일을 삭제합니다. 개발/테스트 용도로만 사용하세요!

#### 성공 응답 (200 OK)

```json
{
  "success": true,
  "message": "5개의 할일이 삭제되었습니다.",
  "deletedCount": 5
}
```

#### cURL 예시

```bash
curl -X DELETE http://localhost:5000/api/todos
```

---

## 🔍 상태 코드

| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 (유효성 검사 실패) |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 에러 |

---

## 🧪 Postman으로 테스트하기

### 1. 할일 생성

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/todos`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "task": "Postman 테스트",
     "date": "2026-01-08",
     "time": "16:00",
     "priority": "medium"
   }
   ```

### 2. 할일 조회

1. **Method**: GET
2. **URL**: `http://localhost:5000/api/todos`

### 3. 할일 수정

1. **Method**: PUT
2. **URL**: `http://localhost:5000/api/todos/{id}` (실제 ID로 교체)
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "completed": true
   }
   ```

---

## 💡 사용 예시

### JavaScript (Fetch API)

```javascript
// 할일 생성
async function createTodo() {
  const response = await fetch('http://localhost:5000/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      task: '프로젝트 발표 준비하기',
      date: '2026-01-10',
      time: '14:30',
      priority: 'high'
    })
  });
  
  const data = await response.json();
  console.log(data);
}

// 모든 할일 조회
async function getTodos() {
  const response = await fetch('http://localhost:5000/api/todos');
  const data = await response.json();
  console.log(data);
}

// 할일 완료 토글
async function toggleTodo(id) {
  const response = await fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
    method: 'PATCH'
  });
  
  const data = await response.json();
  console.log(data);
}

// 할일 삭제
async function deleteTodo(id) {
  const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: 'DELETE'
  });
  
  const data = await response.json();
  console.log(data);
}
```

---

## ⚠️ 에러 처리

모든 API는 다음과 같은 형식으로 에러를 반환합니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "errors": ["상세 에러 1", "상세 에러 2"]
}
```

### 일반적인 에러

1. **할일을 입력해주세요**
   - `task` 필드가 비어있음

2. **올바른 시간 형식이 아닙니다**
   - `time` 필드가 HH:MM 형식이 아님

3. **할일을 찾을 수 없습니다**
   - 해당 ID의 할일이 존재하지 않음

4. **잘못된 ID 형식입니다**
   - MongoDB ObjectId 형식이 아님

---

## 📌 참고사항

- 모든 날짜는 UTC 시간대로 저장됩니다
- 할일은 날짜와 시간 순으로 자동 정렬됩니다
- `priority` 기본값은 `medium`입니다
- `completed` 기본값은 `false`입니다

---

**서버 주소**: http://localhost:5000  
**API Base URL**: http://localhost:5000/api/todos
