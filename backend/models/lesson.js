const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: String,
  video: String, // Path or URL to the uploaded video file
});

lessonSchema.statics.createLesson = function (courseId, title, content, video) {
  return this.create({ course_id: courseId, title, content, video });
};

lessonSchema.statics.getLessonsByCourse = function (courseId) {
  return this.find({ course_id: courseId });
};

lessonSchema.statics.updateLesson = function (id, title, content, video) {
  const update = { title, content };
  if (video !== undefined) update.video = video;
  return this.findByIdAndUpdate(id, update, { new: true });
};

lessonSchema.statics.deleteLesson = function (id) {
  return this.findByIdAndDelete(id);
};

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson; 