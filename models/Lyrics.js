const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LyricsSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  lyrics: {
    type: String,
    required: true
  },

  user: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("lyrics", LyricsSchema);
