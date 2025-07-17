const express = require('express');
const router = express.Router();
const cors = require('cors');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Progress = require('../models/progress');
const Lesson = require('../models/lesson');

// All routes require student authentication
router.use(authenticateToken, requireRole('student'));

// Browse published courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    // Only show published courses
    res.json(courses.filter(c => c.published));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Enroll in a course
router.post('/courses/:courseId/enroll', async (req, res) => {
  try {
    await Enrollment.enrollStudent(req.user.id, req.params.courseId);
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling in course', error: err.message });
  }
});

// Get enrolled courses
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user_id: req.user.id }).populate('course_id');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrollments', error: err.message });
  }
});

// Track lesson progress (mark as complete)
router.post('/lessons/:lessonId/progress', async (req, res) => {
  try {
    await Progress.markLessonComplete(req.user.id, req.params.lessonId);
    res.json({ message: 'Lesson marked as complete' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking progress' });
  }
});

// Get progress for a lesson
router.get('/lessons/:lessonId/progress', async (req, res) => {
  try {
    const progress = await Progress.getLessonProgress(req.user.id, req.params.lessonId);
    res.json({ completed: progress ? !!progress.completed : false });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Get lessons for a course (for enrolled students)
router.get('/courses/:courseId/lessons', async (req, res) => {
  try {
    const enrollments = await Enrollment.getEnrolledCourses(req.user.id);
    // Debug log
    console.log('Enrollments:', enrollments.map(e => (typeof e.course_id === 'object' && e.course_id._id) ? e.course_id._id.toString() : e.course_id.toString()), 'Requested:', req.params.courseId);
    // Robust comparison
    const enrolled = enrollments.some(e => {
      const cid = (typeof e.course_id === 'object' && e.course_id._id) ? e.course_id._id.toString() : e.course_id.toString();
      return cid === req.params.courseId;
    });
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
    const lessons = await Lesson.getLessonsByCourse(req.params.courseId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons', error: err.message });
  }
});

module.exports = router; 