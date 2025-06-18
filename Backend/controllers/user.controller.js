import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const newUser = new User({ username, email, password, role, avatar });
    const savedUser = await newUser.save();

    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      avatar: savedUser.avatar
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user.', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, bio, avatar },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user.', error: error.message });
  }
};