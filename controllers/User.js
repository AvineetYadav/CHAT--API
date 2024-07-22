import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, password, and email are required" });
  }

  try {
    // Check for existing email and username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // Corrected to check email instead of username
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie(`token`, token, {
      httpOnly: true,
      secure: true,
      sameSite: `strict`,
    });
    res.json({ message: `Login successful` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId, username } = req.query;

    if (!userId && !username) {
      return res
        .status(400)
        .json({ message: `User Id or username is required` });
    }

    let user;
    if (userId) {
      user = await User.findOne(userId);
    } else if (username) {
      user = await User.findOne(username);
    }

    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }

    const { password, ...userProfile } = user.toObject();
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now() + 1 * 3600 * 1000), // Set cookie expiration to 1 hour from now
      httpOnly: true, // Ensure cookies are only sent over HTTP(S), not accessible via JavaScript
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};
