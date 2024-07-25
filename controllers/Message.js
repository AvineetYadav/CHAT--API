import Message from "../model/message.js";

export const getMessages = async (req, res) => {
  try {
    const { username, userId, search, page = 1, limit = 20 } = req.query;
    let filter = {};

    // Check for valid userId and username, and set filter accordingly
    if (username) {
      const foundUser = await User.findOne({ username });

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }
      filter.sender = foundUser._id;
    } else if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      filter.sender = userId;
    }

    // Search content with regex if search term is provided
    if (search) {
      filter.content = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Fetch messages with pagination
    const messages = await Message.find(filter)
      .populate("sender", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec(); // Ensure the query executes

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

  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: "Sender is required" });
  }

  const newMessage = new Message({
    sender: req.user._id, // Use `req.user.userId` as the sender
    content,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
