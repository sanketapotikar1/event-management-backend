const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },

  EventImage: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  SpeakerName: {
    type: String,
    required: true,
  },

  SpeakerDetails: {
    type: String,
    required: true,
  },

  startDateTime: {
    type: String,
    required: true,
  },

  endDateTime: {
    type: String,
    required: true,
  },

  userRegister: [
    
  ]
});

// createing model

const eventdb = new mongoose.model("events", eventSchema);

module.exports = eventdb;
