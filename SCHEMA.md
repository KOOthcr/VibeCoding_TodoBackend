# Todo 데이터베이스 스키마 📋

MongoDB를 사용한 Todo List 데이터베이스 스키마 문서입니다.

## 📊 스키마 구조

### Todo 컬렉션 (테이블)

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `_id` | ObjectId | 자동생성 | MongoDB 고유 ID | `507f1f77bcf86cd799439011` |
| `task` | String | ✅ | 할일 내용 | `"프로젝트 발표 준비"` |
| `date` | Date | ✅ | 날짜 | `2026-01-08T00:00:00.000Z` |
| `time` | String | ✅ | 시간 (HH:MM 형식) | `"14:30"` |
| `completed` | Boolean | ❌ | 완료 여부 | `false` (기본값) |
| `priority` | String | ❌ | 우선순위 | `"medium"` (기본값) |
| `createdAt` | Date | 자동생성 | 생성 일시 | `2026-01-08T16:03:20.000Z` |
| `updatedAt` | Date | 자동생성 | 수정 일시 | `2026-01-08T16:03:20.000Z` |

## 🔍 필드 상세 설명

### 1. task (할일)
- **타입**: String
- **필수**: ✅ Yes
- **제약조건**:
  - 최소 길이: 1글자
  - 최대 길이: 500글자
  - 앞뒤 공백 자동 제거
- **예시**: 
  ```json
  "task": "MongoDB 스키마 공부하기"
  ```

### 2. date (날짜)
- **타입**: Date
- **필수**: ✅ Yes
- **기본값**: 현재 날짜
- **형식**: ISO 8601 날짜 형식
- **예시**:
  ```json
  "date": "2026-01-08T00:00:00.000Z"
  ```

### 3. time (시간)
- **타입**: String
- **필수**: ✅ Yes
- **형식**: `HH:MM` (24시간 형식)
- **유효성 검사**: 정규식 패턴 `/^([01]\d|2[0-3]):([0-5]\d)$/`
- **예시**:
  ```json
  "time": "14:30"
  "time": "09:00"
  "time": "23:59"
  ```

### 4. completed (완료 여부)
- **타입**: Boolean
- **필수**: ❌ No
- **기본값**: `false`
- **설명**: 할일 완료 여부를 표시
- **예시**:
  ```json
  "completed": false  // 미완료
  "completed": true   // 완료
  ```

### 5. priority (우선순위)
- **타입**: String (Enum)
- **필수**: ❌ No
- **기본값**: `"medium"`
- **가능한 값**: `"low"`, `"medium"`, `"high"`
- **예시**:
  ```json
  "priority": "high"    // 높음
  "priority": "medium"  // 보통
  "priority": "low"     // 낮음
  ```

### 6. createdAt / updatedAt (타임스탬프)
- **타입**: Date
- **자동 생성**: ✅ Yes
- **설명**: 
  - `createdAt`: 문서가 처음 생성된 시간
  - `updatedAt`: 문서가 마지막으로 수정된 시간

## 🎯 가상 필드

### fullDateTime
날짜와 시간을 합친 완전한 날짜/시간 문자열을 반환합니다.

```javascript
// 예시
{
  "date": "2026-01-08T00:00:00.000Z",
  "time": "14:30",
  "fullDateTime": "2026-01-08 14:30"  // 가상 필드
}
```

## 📝 데이터 예시

### 완전한 Todo 문서 예시

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "task": "MongoDB 스키마 설계 완료하기",
  "date": "2026-01-08T00:00:00.000Z",
  "time": "14:30",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-01-08T16:03:20.123Z",
  "updatedAt": "2026-01-08T16:03:20.123Z",
  "fullDateTime": "2026-01-08 14:30"
}
```

### 최소 필수 데이터

```json
{
  "task": "할일 내용",
  "date": "2026-01-08",
  "time": "14:30"
}
```

## 🔧 인덱스

성능 향상을 위해 다음 인덱스가 생성됩니다:

1. **날짜/시간 인덱스**: `{ date: 1, time: 1 }`
   - 날짜와 시간 순으로 정렬할 때 빠른 조회

2. **완료 여부 인덱스**: `{ completed: 1 }`
   - 완료/미완료 할일을 필터링할 때 빠른 조회

## 🚀 사용 예시

### 1. Todo 생성

```javascript
const newTodo = {
  task: "프로젝트 발표 준비",
  date: new Date("2026-01-10"),
  time: "15:00",
  priority: "high"
};
```

### 2. Todo 조회

```javascript
// 특정 날짜의 할일 조회
const todos = await Todo.find({
  date: {
    $gte: new Date("2026-01-08"),
    $lt: new Date("2026-01-09")
  }
}).sort({ time: 1 });

// 미완료 할일만 조회
const incompleteTodos = await Todo.find({ completed: false });

// 우선순위가 높은 할일 조회
const highPriorityTodos = await Todo.find({ priority: "high" });
```

### 3. Todo 수정

```javascript
// 할일 완료 처리
await Todo.findByIdAndUpdate(todoId, {
  completed: true
});

// 시간 변경
await Todo.findByIdAndUpdate(todoId, {
  time: "16:00"
});
```

### 4. Todo 삭제

```javascript
await Todo.findByIdAndDelete(todoId);
```

## ✅ 유효성 검사

스키마에 내장된 유효성 검사:

1. **task**: 
   - ❌ 빈 문자열 불가
   - ❌ 500자 초과 불가
   - ✅ 자동 공백 제거

2. **date**:
   - ❌ 날짜 형식이 아닌 값 불가
   - ✅ 기본값: 현재 날짜

3. **time**:
   - ❌ `HH:MM` 형식이 아닌 값 불가
   - ❌ 예: `"25:00"`, `"12:60"`, `"1:30"` 등은 불가
   - ✅ 예: `"00:00"`, `"14:30"`, `"23:59"` 등은 가능

4. **priority**:
   - ❌ `"low"`, `"medium"`, `"high"` 외의 값 불가

## 📌 참고사항

- MongoDB는 NoSQL 데이터베이스이므로 "테이블" 대신 "컬렉션"이라고 부릅니다.
- `_id` 필드는 MongoDB가 자동으로 생성하는 고유 식별자입니다.
- `timestamps: true` 옵션으로 `createdAt`과 `updatedAt`이 자동 관리됩니다.
- 날짜는 UTC 시간대로 저장되므로, 클라이언트에서 로컬 시간대로 변환이 필요할 수 있습니다.

---

**스키마 파일 위치**: [`models/Todo.js`](file:///c:/Users/지능형1/Desktop/coding/Mysite/study/todolist_backend/models/Todo.js)
