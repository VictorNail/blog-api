const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const baseSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
  id: {
    type: String,
    default: uuidv4,
  },
  username: {
    type: String,
  },
});

module.exports = mongoose.model("Profile", baseSchema);
