const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.createUser = async function (username, password, role) {
  const user = new this({ username, password, role });
  return await user.save();
};

userSchema.statics.findUserByUsername = function (username) {
  return this.findOne({ username });
};

userSchema.statics.findUserById = function (id) {
  return this.findById(id);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 