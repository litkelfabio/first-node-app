const mongoose = require('mongoose')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
}, {
    timestamps: true
});
const Task = mongoose.model('tasks', taskSchema);

module.exports = Task;