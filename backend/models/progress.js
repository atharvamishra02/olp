const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

progressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

progressSchema.statics.markLessonComplete = function (userId, lessonId) {
  return this.findOneAndUpdate(
    { user_id: userId, lesson_id: lessonId },
    { completed: true },
    { upsert: true, new: true }
  );
};

progressSchema.statics.getLessonProgress = function (userId, lessonId) {
  return this.findOne({ user_id: userId, lesson_id: lessonId });
};

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress; 