// Todo 라우터
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// ==================== CREATE ====================
// POST /api/todos - 새로운 할일 생성
router.post('/', async (req, res) => {
    try {
        const { task, date, time, priority } = req.body;

        // 필수 필드 검증
        if (!task) {
            return res.status(400).json({
                success: false,
                message: '할일을 입력해주세요.'
            });
        }

        if (!date) {
            return res.status(400).json({
                success: false,
                message: '날짜를 입력해주세요.'
            });
        }

        if (!time) {
            return res.status(400).json({
                success: false,
                message: '시간을 입력해주세요.'
            });
        }

        // 시간 형식 검증 (HH:MM)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(time)) {
            return res.status(400).json({
                success: false,
                message: '올바른 시간 형식이 아닙니다. (예: 14:30)'
            });
        }

        // 새로운 Todo 생성
        const newTodo = new Todo({
            task,
            date: new Date(date),
            time,
            priority: priority || 'medium' // 기본값: medium
        });

        // 데이터베이스에 저장
        const savedTodo = await newTodo.save();

        // 성공 응답
        res.status(201).json({
            success: true,
            message: '할일이 성공적으로 생성되었습니다.',
            data: savedTodo
        });

    } catch (error) {
        console.error('❌ Todo 생성 에러:', error);

        // Mongoose 유효성 검사 에러 처리
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '유효성 검사 실패',
                errors: messages
            });
        }

        // 서버 에러
        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// ==================== READ ====================
// GET /api/todos - 모든 할일 조회
router.get('/', async (req, res) => {
    try {
        const { completed, priority, date } = req.query;

        // 필터 객체 생성
        const filter = {};

        // 완료 여부 필터
        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        // 우선순위 필터
        if (priority) {
            filter.priority = priority;
        }

        // 날짜 필터
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        }

        // 할일 조회 (날짜, 시간 순으로 정렬)
        const todos = await Todo.find(filter).sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });

    } catch (error) {
        console.error('❌ Todo 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// GET /api/todos/:id - 특정 할일 조회
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: '할일을 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });

    } catch (error) {
        console.error('❌ Todo 조회 에러:', error);

        // 잘못된 ID 형식
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: '잘못된 ID 형식입니다.'
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// ==================== UPDATE ====================
// PUT /api/todos/:id - 할일 수정
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task, date, time, priority, completed } = req.body;

        // 수정할 데이터 객체 생성
        const updateData = {};

        if (task !== undefined) updateData.task = task;
        if (date !== undefined) updateData.date = new Date(date);
        if (time !== undefined) {
            // 시간 형식 검증
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (!timeRegex.test(time)) {
                return res.status(400).json({
                    success: false,
                    message: '올바른 시간 형식이 아닙니다. (예: 14:30)'
                });
            }
            updateData.time = time;
        }
        if (priority !== undefined) updateData.priority = priority;
        if (completed !== undefined) updateData.completed = completed;

        // 할일 수정
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // 수정된 문서 반환, 유효성 검사 실행
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: '할일을 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            message: '할일이 성공적으로 수정되었습니다.',
            data: updatedTodo
        });

    } catch (error) {
        console.error('❌ Todo 수정 에러:', error);

        // 잘못된 ID 형식
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: '잘못된 ID 형식입니다.'
            });
        }

        // 유효성 검사 에러
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '유효성 검사 실패',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// PATCH /api/todos/:id/toggle - 완료 상태 토글
router.patch('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: '할일을 찾을 수 없습니다.'
            });
        }

        // 완료 상태 토글
        todo.completed = !todo.completed;
        await todo.save();

        res.status(200).json({
            success: true,
            message: `할일이 ${todo.completed ? '완료' : '미완료'} 처리되었습니다.`,
            data: todo
        });

    } catch (error) {
        console.error('❌ Todo 토글 에러:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: '잘못된 ID 형식입니다.'
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// ==================== DELETE ====================
// DELETE /api/todos/:id - 할일 삭제
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: '할일을 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            message: '할일이 성공적으로 삭제되었습니다.',
            data: deletedTodo
        });

    } catch (error) {
        console.error('❌ Todo 삭제 에러:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: '잘못된 ID 형식입니다.'
            });
        }

        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

// DELETE /api/todos - 모든 할일 삭제 (개발용)
router.delete('/', async (req, res) => {
    try {
        const result = await Todo.deleteMany({});

        res.status(200).json({
            success: true,
            message: `${result.deletedCount}개의 할일이 삭제되었습니다.`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('❌ Todo 전체 삭제 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 에러가 발생했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
