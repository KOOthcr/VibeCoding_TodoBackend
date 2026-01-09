// ==================== 백엔드 API 설정 ====================
const API_BASE_URL = 'http://localhost:5000/api/todos';

// ==================== 전역 변수 및 초기화 ====================
let todos = [];
let editingId = null;

// DOM 요소 참조
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoDate = document.getElementById('todoDate');
const todoTime = document.getElementById('todoTime');
const todoList = document.getElementById('todoList');
const todosCount = document.getElementById('todosCount');
const emptyState = document.getElementById('emptyState');
const currentDateElement = document.getElementById('currentDate');

// ==================== 초기 설정 ====================
// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeAppData();
});

function initializeAppData() {
    // 백엔드에서 할일 목록 불러오기
    loadTodosFromBackend();

    // 현재 날짜 표시
    updateCurrentDate();

    // 오늘 날짜와 현재 시간을 기본값으로 설정
    setDefaultDateTime();

    // 이벤트 리스너 등록
    todoForm.addEventListener('submit', handleAddTodo);

    // 할일 목록 이벤트 리스너 설정 (한 번만 실행)
    setupTodoListeners();
}

// 할일 목록 이벤트 리스너 설정 (이벤트 위임)
function setupTodoListeners() {
    // 이벤트 위임을 사용하여 모든 버튼 클릭 처리
    todoList.addEventListener('click', (e) => {
        const target = e.target;

        // 삭제 버튼 클릭
        if (target.classList.contains('delete-btn')) {
            const todoId = target.getAttribute('data-todo-id');
            deleteTodo(todoId);
        }

        // 수정 버튼 클릭
        if (target.classList.contains('edit-btn')) {
            const todoId = target.getAttribute('data-todo-id');
            startEdit(todoId);
        }

        // 취소 버튼 클릭
        if (target.classList.contains('cancel-btn')) {
            cancelEdit();
        }
    });

    // 체크박스 변경 이벤트
    todoList.addEventListener('change', (e) => {
        if (e.target.classList.contains('todo-checkbox')) {
            const todoId = e.target.getAttribute('data-todo-id');
            toggleTodo(todoId);
        }
    });

    // 수정 폼 제출 이벤트
    todoList.addEventListener('submit', (e) => {
        if (e.target.classList.contains('edit-form')) {
            e.preventDefault();
            const todoId = e.target.getAttribute('data-todo-id');
            saveEdit(todoId);
        }
    });
}

// ==================== 날짜/시간 관련 함수 ====================
function updateCurrentDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    currentDateElement.textContent = now.toLocaleDateString('ko-KR', options);
}

function setDefaultDateTime() {
    const now = new Date();

    // 날짜 설정 (YYYY-MM-DD 형식)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    todoDate.value = `${year}-${month}-${day}`;

    // 시간 설정 (HH:MM 형식)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    todoTime.value = `${hours}:${minutes}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return `${month}월 ${day}일 (${weekday})`;
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

    return `${ampm} ${displayHour}:${minutes}`;
}

// ==================== 백엔드 API 통신 함수 ====================
// 모든 할일 불러오기
async function loadTodosFromBackend() {
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (data.success) {
            todos = data.data;
            renderTodos();
        } else {
            console.error('할일 불러오기 실패:', data.message);
            alert('할일을 불러오는데 실패했습니다.');
        }
    } catch (error) {
        console.error('할일 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
}

// 할일 추가
async function addTodoToBackend(todoData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            alert('할일 추가 실패: ' + data.message);
            return null;
        }
    } catch (error) {
        console.error('할일 추가 오류:', error);
        alert('할일을 추가하는 중 오류가 발생했습니다.');
        return null;
    }
}

// 할일 수정
async function updateTodoInBackend(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            alert('할일 수정 실패: ' + data.message);
            return null;
        }
    } catch (error) {
        console.error('할일 수정 오류:', error);
        alert('할일을 수정하는 중 오류가 발생했습니다.');
        return null;
    }
}

// 완료 상태 토글
async function toggleTodoInBackend(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
            method: 'PATCH'
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            alert('상태 변경 실패: ' + data.message);
            return null;
        }
    } catch (error) {
        console.error('상태 변경 오류:', error);
        alert('상태를 변경하는 중 오류가 발생했습니다.');
        return null;
    }
}

// 할일 삭제
async function deleteTodoFromBackend(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            alert('할일 삭제 실패: ' + data.message);
            return false;
        }
    } catch (error) {
        console.error('할일 삭제 오류:', error);
        alert('할일을 삭제하는 중 오류가 발생했습니다.');
        return false;
    }
}

// ==================== 할일 CRUD 함수 ====================
async function handleAddTodo(e) {
    e.preventDefault();

    const text = todoInput.value.trim();
    const date = todoDate.value;
    const time = todoTime.value;

    if (!text || !date || !time) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    const newTodo = {
        task: text,
        date: date,
        time: time,
        priority: 'medium' // 기본 우선순위
    };

    const addedTodo = await addTodoToBackend(newTodo);

    if (addedTodo) {
        // 폼 초기화
        todoInput.value = '';
        setDefaultDateTime();
        todoInput.focus();

        // 추가 애니메이션 효과
        playAddAnimation();

        // 할일 목록 다시 불러오기
        await loadTodosFromBackend();
    }
}

async function deleteTodo(id) {
    if (confirm('이 할일을 삭제하시겠습니까?')) {
        const success = await deleteTodoFromBackend(id);
        if (success) {
            // 할일 목록 다시 불러오기
            await loadTodosFromBackend();
        }
    }
}

async function toggleTodo(id) {
    const updatedTodo = await toggleTodoInBackend(id);
    if (updatedTodo) {
        // 할일 목록 다시 불러오기
        await loadTodosFromBackend();
    }
}

function startEdit(id) {
    editingId = id;
    renderTodos();
}

function cancelEdit() {
    editingId = null;
    renderTodos();
}

async function saveEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const editInput = todoItem.querySelector('.edit-input');
    const editDateInput = todoItem.querySelector('.edit-date-input');
    const editTimeInput = todoItem.querySelector('.edit-time-input');

    const newText = editInput.value.trim();
    const newDate = editDateInput.value;
    const newTime = editTimeInput.value;

    if (!newText || !newDate || !newTime) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    const updates = {
        task: newText,
        date: newDate,
        time: newTime
    };

    const updatedTodo = await updateTodoInBackend(id, updates);

    if (updatedTodo) {
        editingId = null;
        // 할일 목록 다시 불러오기
        await loadTodosFromBackend();
    }
}

// ==================== UI 렌더링 함수 ====================
function renderTodos() {
    // 할일이 없으면 빈 상태 표시
    if (todos.length === 0) {
        todoList.innerHTML = '';
        emptyState.classList.add('show');
        todosCount.textContent = '0개';
        return;
    }

    emptyState.classList.remove('show');
    todosCount.textContent = `${todos.length}개`;

    // 날짜와 시간 순으로 정렬 (이미 백엔드에서 정렬되어 있음)
    const sortedTodos = [...todos].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeA - dateTimeB;
    });

    todoList.innerHTML = sortedTodos.map(todo => createTodoElement(todo)).join('');
}

function createTodoElement(todo) {
    const isEditing = editingId === todo._id;
    const completedClass = todo.completed ? 'completed' : '';
    const editingClass = isEditing ? 'editing' : '';

    return `
        <li class="todo-item ${completedClass} ${editingClass}" data-id="${todo._id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                data-todo-id="${todo._id}"
            >
            
            <div class="todo-content">
                <div class="todo-text">${escapeHtml(todo.task)}</div>
                <div class="todo-datetime">
                    <span class="todo-date">${formatDate(todo.date)}</span>
                    <span class="todo-time">${formatTime(todo.time)}</span>
                </div>
                
                <form class="edit-form" data-todo-id="${todo._id}">
                    <input 
                        type="text" 
                        class="edit-input" 
                        value="${escapeHtml(todo.task)}"
                        required
                    >
                    <div class="edit-datetime">
                        <input 
                            type="date" 
                            class="edit-date-input" 
                            value="${new Date(todo.date).toISOString().split('T')[0]}"
                            required
                        >
                        <input 
                            type="time" 
                            class="edit-time-input" 
                            value="${todo.time}"
                            required
                        >
                    </div>
                    <div class="edit-actions">
                        <button type="submit" class="save-btn">저장</button>
                        <button type="button" class="cancel-btn">취소</button>
                    </div>
                </form>
            </div>
            
            <div class="todo-actions">
                <button class="edit-btn" data-todo-id="${todo._id}" ${isEditing ? 'style="display:none"' : ''}>
                    수정
                </button>
                <button class="delete-btn" data-todo-id="${todo._id}">
                    삭제
                </button>
            </div>
        </li>
    `;
}

// ==================== 유틸리티 함수 ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function playAddAnimation() {
    // 추가 시 간단한 피드백 효과
    const addBtn = document.querySelector('.add-btn');
    addBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addBtn.style.transform = '';
    }, 200);
}

// ==================== 키보드 단축키 ====================
document.addEventListener('keydown', (e) => {
    // ESC 키로 수정 취소
    if (e.key === 'Escape' && editingId !== null) {
        cancelEdit();
    }
});

// ==================== 주기적인 날짜 업데이트 ====================
// 자정이 지나면 날짜 자동 업데이트
setInterval(() => {
    updateCurrentDate();
}, 60000); // 1분마다 체크

// ==================== 실시간 날짜/시간 업데이트 ====================
// 입력 필드의 날짜와 시간을 실시간으로 업데이트
function updateDateTimeInputs() {
    // 사용자가 입력 중이 아닐 때만 업데이트
    if (document.activeElement !== todoDate && document.activeElement !== todoTime) {
        setDefaultDateTime();
    }
}

// 1초마다 날짜/시간 업데이트
setInterval(() => {
    updateDateTimeInputs();
}, 1000); // 1초마다 업데이트

// ==================== 주기적인 할일 목록 새로고침 (선택사항) ====================
// 실시간 동기화가 필요한 경우 주석 해제
// setInterval(() => {
//     loadTodosFromBackend();
// }, 30000); // 30초마다 새로고침
