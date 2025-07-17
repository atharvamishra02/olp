const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  published: { type: Boolean, default: false },
  image: String, // Path or URL to the uploaded image file
});

courseSchema.statics.createCourse = function (title, description, published, image) {
  return this.create({ title, description, published, image });
};

courseSchema.statics.getAllCourses = function () {
  return this.find();
};

courseSchema.statics.updateCourse = function (id, title, description, published, image) {
  const update = { title, description, published };
  if (image !== undefined) update.image = image;
  return this.findByIdAndUpdate(id, update, { new: true });
};

courseSchema.statics.deleteCourse = function (id) {
  return this.findByIdAndDelete(id);
};

const Course = mongoose.model('Course', courseSchema);
module.exports = Course; 