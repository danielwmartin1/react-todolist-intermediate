import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (v) => v ? new Date(v).toISOString() : null,
    },
    updatedAt: {
        type: Date,
        get: (v) => v ? new Date(v).toISOString() : null,
    },
    completedAt: {
        type: Date,
        get: (v) => v ? new Date(v).toISOString() : null,
    },
});

todoSchema.pre('save', function(next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    } else {
        this.updatedAt = Date.now();
    }

    if (this.isModified('completed')) {
        this.completedAt = this.completed ? Date.now() : null;
    }

    next();
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
