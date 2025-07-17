const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const multer = require('multer');
const path = require('path');

// All routes require admin authentication
router.use(authenticateToken, requireRole('admin'));

// Set up multer storage for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// CRUD for courses
router.get('/courses', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const courses = await Course.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// POST /api/admin/courses (with image upload)
router.post('/courses', upload.single('image'), (req, res) => {
  const { title, description, published } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  if (!title) return res.status(400).json({ message: 'Title required' });
  Course.createCourse(title, description, published, image)
    .then(() => res.json({ message: 'Course created' }))
    .catch(err => res.status(500).json({ message: 'Error creating course' }));
});

// PUT /api/admin/courses/:id (with image upload)
router.put('/courses/:id', upload.single('image'), async (req, res) => {
  const { title, description, published } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    await Course.updateCourse(req.params.id, title, description, published, image);
    res.json({ message: 'Course updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course' });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// CRUD for lessons
router.get('/courses/:courseId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.getLessonsByCourse(req.params.courseId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// POST /api/admin/courses/:courseId/lessons (with video upload)
router.post('/courses/:courseId/lessons', upload.single('video'), async (req, res) => {
  const { title, content } = req.body;
  const video = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    await Lesson.createLesson(req.params.courseId, title, content, video);
    res.json({ message: 'Lesson created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating lesson' });
  }
});

// PUT /api/admin/lessons/:id (with video upload)
router.put('/lessons/:id', upload.single('video'), async (req, res) => {
  const { title, content } = req.body;
  const video = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    await Lesson.updateLesson(req.params.id, title, content, video);
    res.json({ message: 'Lesson updated' });
  } catch (err) {
    console.error('Error updating lesson:', err);
    res.status(500).json({ message: 'Error updating lesson', error: err.message });
  }
});

router.delete('/lessons/:id', async (req, res) => {
  try {
    await Lesson.deleteLesson(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    console.error('Error deleting lesson:', err);
    res.status(500).json({ message: 'Error deleting lesson', error: err.message });
  }
});

module.exports = router; 