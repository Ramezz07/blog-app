const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  category: {
    type: String,
    enum: ['Technology', 'Travel', 'Food', 'Health', 'Business', 'Sports', 'Entertainment', 'Other'],
    default: 'Other'
  },
  tags: [{ type: String }],
  coverImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
