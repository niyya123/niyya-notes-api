const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

var Images = mongoose.model("Images", imageSchema)

module.exports = Images;     