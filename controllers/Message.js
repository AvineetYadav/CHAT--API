import Message from "../model/message.js";

export const getMessages = async (req, res) => {
  try {
    const { username, search } = req.query;
    let filter = {};

    if (username) {
      const foundUser = await User.findOne({ username });

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }
      filter.sender = foundUser._id;
    }

    if (search) {
      filter.content = { $regex: search, $options: "i" };
    }

    if (username) {
      filter.content = { $regex: search, $options: "i" };
    }

    const messages = await Message.find(filter).populate(
      "sender",
      "username"
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postMessage = async (req, res) => {
  const { content } = req.body; 

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (!req.user || !req.user.userId) {
    return res.status(400).json({ message: "Sender is required" });
  }

  const newMessage = new Message({
    sender: req.user.userId, // Use `req.user.userId` as the sender
    content,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
