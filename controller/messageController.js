const messages = require("../models/MessageModel");

// Save message
exports.saveMessageController = async (data) => {
  const newMessage = new messages({
    sender: data.from,
    receiver: data.to,
    message: data.message,
    timestamp: new Date()
  });

  const saved = await newMessage.save();

  
  return {
    from: saved.sender,
    to: saved.receiver,
    message: saved.message,
    timestamp: saved.timestamp,
  };
};

// Get previous messages
exports.getMessagesController = async (req, res) => {
  const { user1, user2 } = req.params

  try {
    const chat = await messages.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 })

    res.status(200).json(chat)
  } catch (err) {
    res.status(500).json(err)
  }
}

// Mark as seen
exports.markAsSeenController = async (req, res) => {
  const { sender, receiver } = req.body

  await messages.updateMany(
    { sender, receiver, seen: false },
    { $set: { seen: true } }
  )

  res.status(200).json("Seen updated")
}