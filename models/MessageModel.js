const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  seen: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("messages", messageSchema)