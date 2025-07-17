const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

enrollmentSchema.statics.enrollStudent = function (userId, courseId) {
  return this.create({ user_id: userId, course_id: courseId });
};

enrollmentSchema.statics.getEnrolledCourses = function (userId) {
  return this.find({ user_id: userId });
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment; 