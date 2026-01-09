// Todo 스키마 테스트 예제
// 이 파일은 스키마가 올바르게 작동하는지 테스트하기 위한 예제입니다.

const mongoose = require('mongoose');
const Todo = require('./models/Todo');
require('dotenv').config();

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist';

async function testTodoSchema() {
    try {
        // MongoDB 연결
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 연결 성공!\n');

        // 기존 테스트 데이터 삭제 (선택 사항)
        // await Todo.deleteMany({});
        // console.log('🗑️  기존 테스트 데이터 삭제 완료\n');

        // 1. Todo 생성 테스트
        console.log('📝 1. Todo 생성 테스트');
        console.log('─'.repeat(50));

        const newTodo = new Todo({
            task: '프로젝트 발표 준비하기',
            date: new Date('2026-01-10'),
            time: '14:30',
            priority: 'high'
        });

        const savedTodo = await newTodo.save();
        console.log('✅ Todo 생성 성공!');
        console.log(JSON.stringify(savedTodo, null, 2));
        console.log('\n');

        // 2. 여러 Todo 생성
        console.log('📝 2. 여러 Todo 생성 테스트');
        console.log('─'.repeat(50));

        const todos = await Todo.insertMany([
            {
                task: 'MongoDB 공부하기',
                date: new Date('2026-01-08'),
                time: '10:00',
                priority: 'medium'
            },
            {
                task: '운동하기',
                date: new Date('2026-01-08'),
                time: '18:00',
                priority: 'low',
                completed: false
            },
            {
                task: '책 읽기',
                date: new Date('2026-01-09'),
                time: '20:00',
                priority: 'medium'
            }
        ]);

        console.log(`✅ ${todos.length}개의 Todo 생성 성공!`);
        console.log('\n');

        // 3. Todo 조회 테스트
        console.log('🔍 3. Todo 조회 테스트');
        console.log('─'.repeat(50));

        const allTodos = await Todo.find().sort({ date: 1, time: 1 });
        console.log(`✅ 전체 Todo 개수: ${allTodos.length}`);
        allTodos.forEach((todo, index) => {
            console.log(`${index + 1}. [${todo.priority}] ${todo.task} - ${todo.fullDateTime}`);
        });
        console.log('\n');

        // 4. 특정 날짜의 Todo 조회
        console.log('🔍 4. 특정 날짜 Todo 조회 (2026-01-08)');
        console.log('─'.repeat(50));

        const todayTodos = await Todo.find({
            date: {
                $gte: new Date('2026-01-08T00:00:00.000Z'),
                $lt: new Date('2026-01-09T00:00:00.000Z')
            }
        }).sort({ time: 1 });

        console.log(`✅ 오늘의 할일: ${todayTodos.length}개`);
        todayTodos.forEach((todo, index) => {
            console.log(`${index + 1}. ${todo.time} - ${todo.task}`);
        });
        console.log('\n');

        // 5. Todo 수정 테스트
        console.log('✏️  5. Todo 수정 테스트');
        console.log('─'.repeat(50));

        const updatedTodo = await Todo.findByIdAndUpdate(
            savedTodo._id,
            { completed: true },
            { new: true } // 수정된 문서 반환
        );

        console.log('✅ Todo 완료 처리 성공!');
        console.log(`할일: ${updatedTodo.task}`);
        console.log(`완료 여부: ${updatedTodo.completed}`);
        console.log('\n');

        // 6. 미완료 Todo 조회
        console.log('🔍 6. 미완료 Todo 조회');
        console.log('─'.repeat(50));

        const incompleteTodos = await Todo.find({ completed: false });
        console.log(`✅ 미완료 할일: ${incompleteTodos.length}개`);
        incompleteTodos.forEach((todo, index) => {
            console.log(`${index + 1}. ${todo.task} - ${todo.fullDateTime}`);
        });
        console.log('\n');

        // 7. 우선순위별 조회
        console.log('🔍 7. 우선순위별 Todo 조회');
        console.log('─'.repeat(50));

        const highPriorityTodos = await Todo.find({ priority: 'high' });
        console.log(`✅ 높은 우선순위 할일: ${highPriorityTodos.length}개`);
        highPriorityTodos.forEach((todo, index) => {
            console.log(`${index + 1}. ${todo.task}`);
        });
        console.log('\n');

        // 8. Todo 삭제 테스트
        console.log('🗑️  8. Todo 삭제 테스트');
        console.log('─'.repeat(50));

        const deletedTodo = await Todo.findByIdAndDelete(savedTodo._id);
        console.log('✅ Todo 삭제 성공!');
        console.log(`삭제된 할일: ${deletedTodo.task}`);
        console.log('\n');

        // 9. 유효성 검사 테스트
        console.log('⚠️  9. 유효성 검사 테스트');
        console.log('─'.repeat(50));

        try {
            const invalidTodo = new Todo({
                task: '', // 빈 문자열 (에러 발생)
                date: new Date(),
                time: '14:30'
            });
            await invalidTodo.save();
        } catch (error) {
            console.log('❌ 예상된 에러 발생 (빈 할일):');
            console.log(`   ${error.message}`);
        }

        try {
            const invalidTimeTodo = new Todo({
                task: '테스트',
                date: new Date(),
                time: '25:00' // 잘못된 시간 형식 (에러 발생)
            });
            await invalidTimeTodo.save();
        } catch (error) {
            console.log('❌ 예상된 에러 발생 (잘못된 시간 형식):');
            console.log(`   ${error.message}`);
        }
        console.log('\n');

        // 최종 통계
        console.log('📊 최종 통계');
        console.log('─'.repeat(50));
        const finalCount = await Todo.countDocuments();
        const completedCount = await Todo.countDocuments({ completed: true });
        const incompleteCount = await Todo.countDocuments({ completed: false });

        console.log(`전체 할일: ${finalCount}개`);
        console.log(`완료: ${completedCount}개`);
        console.log(`미완료: ${incompleteCount}개`);
        console.log('\n');

        console.log('✅ 모든 테스트 완료!');

    } catch (error) {
        console.error('❌ 에러 발생:', error);
    } finally {
        // MongoDB 연결 종료
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB 연결 종료');
    }
}

// 테스트 실행
testTodoSchema();
