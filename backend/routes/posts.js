const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// GET /api/posts — get all published posts (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { published: true };

    if (category && category !== 'All') query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ posts, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id — get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — create post (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, coverImage } = req.body;
    const post = await Post.create({
      title, content, excerpt, category, tags, coverImage,
      author: req.user._id
    });
    const populated = await post.populate('author', 'name email avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/posts/:id — update post (protected, owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to edit this post' });

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('author', 'name email avatar');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — delete post (protected, owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to delete this post' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id/like — toggle like (protected)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/stats/summary — dashboard stats
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const total = await Post.countDocuments({ author: req.user._id });
    const totalViews = await Post.aggregate([
      { $match: { author: req.user._id } },
      { $group: { _id: null, views: { $sum: '$views' } } }
    ]);
    const totalLikes = await Post.aggregate([
      { $match: { author: req.user._id } },
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } }
    ]);
    res.json({
      totalPosts: total,
      totalViews: totalViews[0]?.views || 0,
      totalLikes: totalLikes[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
