// Mongoose 모듈 불러오기
const mongoose = require('mongoose');

// Todo 스키마 정의
const todoSchema = new mongoose.Schema({
    // 할일 내용
    task: {
        type: String,
        required: [true, '할일을 입력해주세요.'],
        trim: true, // 앞뒤 공백 제거
        minlength: [1, '할일은 최소 1글자 이상이어야 합니다.'],
        maxlength: [500, '할일은 최대 500글자까지 입력 가능합니다.']
    },

    // 날짜
    date: {
        type: Date,
        required: [true, '날짜를 입력해주세요.'],
        default: Date.now // 기본값: 현재 날짜
    },

    // 시간
    time: {
        type: String,
        required: [true, '시간을 입력해주세요.'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, '올바른 시간 형식이 아닙니다. (예: 14:30)']
    },

    // 완료 여부 (추가 기능)
    completed: {
        type: Boolean,
        default: false
    },

    // 우선순위 (선택 사항)
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    // 타임스탬프 자동 생성 (생성일, 수정일)
    timestamps: true
});

// 가상 필드: 날짜와 시간을 합친 완전한 DateTime
todoSchema.virtual('fullDateTime').get(function () {
    const dateStr = this.date.toISOString().split('T')[0];
    return `${dateStr} ${this.time}`;
});

// JSON 변환 시 가상 필드 포함
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

// 인덱스 생성 (검색 성능 향상)
todoSchema.index({ date: 1, time: 1 }); // 날짜와 시간으로 정렬
todoSchema.index({ completed: 1 }); // 완료 여부로 필터링

// Todo 모델 생성 및 내보내기
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
