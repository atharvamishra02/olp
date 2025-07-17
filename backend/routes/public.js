const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Lesson = require('../models/lesson');

// Public: Get all published courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.json(courses.filter(c => c.published));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Public: Get lessons for a published course
router.get('/courses/:courseId/lessons', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || !course.published) {
      return res.status(404).json({ message: 'Course not found or not published' });
    }
    const lessons = await Lesson.getLessonsByCourse(req.params.courseId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

module.exports = router; 