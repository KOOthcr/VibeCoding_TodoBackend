// Todo API 테스트 스크립트
// 이 파일은 Todo API가 올바르게 작동하는지 테스트합니다.

const API_BASE_URL = 'http://localhost:5000/api/todos';

// 색상 코드
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// 로그 헬퍼 함수
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 구분선
function separator() {
    console.log('─'.repeat(60));
}

// API 테스트 함수들
async function testCreateTodo() {
    log('\n📝 1. 할일 생성 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: 'API 테스트 - 프로젝트 발표 준비',
                date: '2026-01-10',
                time: '14:30',
                priority: 'high'
            })
        });

        const data = await response.json();

        if (data.success) {
            log('✅ 할일 생성 성공!', 'green');
            console.log('생성된 할일:', data.data);
            return data.data._id; // ID 반환
        } else {
            log('❌ 할일 생성 실패', 'red');
            console.log(data);
            return null;
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return null;
    }
}

async function testGetAllTodos() {
    log('\n🔍 2. 모든 할일 조회 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (data.success) {
            log(`✅ 할일 조회 성공! (총 ${data.count}개)`, 'green');
            data.data.forEach((todo, index) => {
                console.log(`${index + 1}. [${todo.priority}] ${todo.task} - ${todo.time}`);
            });
            return data.data;
        } else {
            log('❌ 할일 조회 실패', 'red');
            console.log(data);
            return [];
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return [];
    }
}

async function testGetTodoById(id) {
    log('\n🔍 3. 특정 할일 조회 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const data = await response.json();

        if (data.success) {
            log('✅ 할일 조회 성공!', 'green');
            console.log('조회된 할일:', data.data);
            return data.data;
        } else {
            log('❌ 할일 조회 실패', 'red');
            console.log(data);
            return null;
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return null;
    }
}

async function testUpdateTodo(id) {
    log('\n✏️  4. 할일 수정 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: 'API 테스트 - 프로젝트 발표 준비 완료',
                time: '15:00'
            })
        });

        const data = await response.json();

        if (data.success) {
            log('✅ 할일 수정 성공!', 'green');
            console.log('수정된 할일:', data.data);
            return data.data;
        } else {
            log('❌ 할일 수정 실패', 'red');
            console.log(data);
            return null;
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return null;
    }
}

async function testToggleTodo(id) {
    log('\n🔄 5. 완료 상태 토글 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
            method: 'PATCH'
        });

        const data = await response.json();

        if (data.success) {
            log(`✅ ${data.message}`, 'green');
            console.log('완료 여부:', data.data.completed);
            return data.data;
        } else {
            log('❌ 토글 실패', 'red');
            console.log(data);
            return null;
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return null;
    }
}

async function testFilterTodos() {
    log('\n🔍 6. 필터링 테스트', 'cyan');
    separator();

    try {
        // 미완료 할일 조회
        log('미완료 할일 조회...', 'yellow');
        const response1 = await fetch(`${API_BASE_URL}?completed=false`);
        const data1 = await response1.json();
        log(`✅ 미완료 할일: ${data1.count}개`, 'green');

        // 특정 날짜 할일 조회
        log('\n특정 날짜 할일 조회 (2026-01-10)...', 'yellow');
        const response2 = await fetch(`${API_BASE_URL}?date=2026-01-10`);
        const data2 = await response2.json();
        log(`✅ 2026-01-10 할일: ${data2.count}개`, 'green');

        // 높은 우선순위 할일 조회
        log('\n높은 우선순위 할일 조회...', 'yellow');
        const response3 = await fetch(`${API_BASE_URL}?priority=high`);
        const data3 = await response3.json();
        log(`✅ 높은 우선순위 할일: ${data3.count}개`, 'green');

    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
    }
}

async function testDeleteTodo(id) {
    log('\n🗑️  7. 할일 삭제 테스트', 'cyan');
    separator();

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            log('✅ 할일 삭제 성공!', 'green');
            console.log('삭제된 할일:', data.data.task);
            return true;
        } else {
            log('❌ 할일 삭제 실패', 'red');
            console.log(data);
            return false;
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
        return false;
    }
}

async function testValidation() {
    log('\n⚠️  8. 유효성 검사 테스트', 'cyan');
    separator();

    // 빈 할일 테스트
    log('빈 할일 생성 시도...', 'yellow');
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: '',
                date: '2026-01-10',
                time: '14:30'
            })
        });

        const data = await response.json();
        if (!data.success) {
            log(`✅ 예상된 에러 발생: ${data.message}`, 'green');
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
    }

    // 잘못된 시간 형식 테스트
    log('\n잘못된 시간 형식 생성 시도...', 'yellow');
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: '테스트',
                date: '2026-01-10',
                time: '25:00'
            })
        });

        const data = await response.json();
        if (!data.success) {
            log(`✅ 예상된 에러 발생: ${data.message}`, 'green');
        }
    } catch (error) {
        log(`❌ 에러: ${error.message}`, 'red');
    }
}

// 메인 테스트 실행
async function runAllTests() {
    log('\n🚀 Todo API 테스트 시작', 'blue');
    log('='.repeat(60), 'blue');

    let todoId = null;

    // 1. 할일 생성
    todoId = await testCreateTodo();

    if (!todoId) {
        log('\n❌ 할일 생성 실패로 테스트 중단', 'red');
        return;
    }

    // 2. 모든 할일 조회
    await testGetAllTodos();

    // 3. 특정 할일 조회
    await testGetTodoById(todoId);

    // 4. 할일 수정
    await testUpdateTodo(todoId);

    // 5. 완료 상태 토글
    await testToggleTodo(todoId);

    // 6. 필터링 테스트
    await testFilterTodos();

    // 7. 유효성 검사 테스트
    await testValidation();

    // 8. 할일 삭제
    await testDeleteTodo(todoId);

    // 최종 확인
    log('\n📊 최종 확인', 'cyan');
    separator();
    await testGetAllTodos();

    log('\n✅ 모든 테스트 완료!', 'blue');
    log('='.repeat(60), 'blue');
}

// 테스트 실행
runAllTests().catch(error => {
    log(`\n❌ 테스트 실행 중 에러: ${error.message}`, 'red');
    console.error(error);
});
