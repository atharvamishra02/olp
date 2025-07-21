const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
// Cloudinary integration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for images and videos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';
    let resource_type = 'auto';
    return {
      folder,
      resource_type,
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
      public_id: Date.now() + '-' + file.originalname.replace(/\s+/g, '_'),
    };
  },
});
const upload = multer({ storage });

// All routes require admin authentication
router.use(authenticateToken, requireRole('admin'));

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
  const image = req.file ? req.file.path : undefined; // Cloudinary URL
  if (!title) return res.status(400).json({ message: 'Title required' });
  Course.createCourse(title, description, published, image)
    .then(course => res.status(201).json(course))
    .catch(err => res.status(500).json({ message: 'Error creating course' }));
});

// PUT /api/admin/courses/:id (with image upload)
router.put('/courses/:id', upload.single('image'), async (req, res) => {
  const { title, description, published } = req.body;
  const image = req.file ? req.file.path : undefined; // Cloudinary URL
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
  const video = req.file ? req.file.path : undefined; // Cloudinary URL
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
  const video = req.file ? req.file.path : undefined; // Cloudinary URL
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