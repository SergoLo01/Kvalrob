const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    type: {
        type: String,
        required: true,
        enum: ['Віддам', 'Позичу', 'Допоможу', 'Шукаю']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    }
}, { timestamps: true });

// Add text index for search
AdSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Ad', AdSchema);