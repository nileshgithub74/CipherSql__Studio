import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};