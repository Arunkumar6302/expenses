const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword, role);
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const { updateUser } = require('../models/userModel');
    const updatedUser = await updateUser(req.user.id, name, email, hashedPassword);
    
    const token = jwt.sign({ id: updatedUser.id, role: updatedUser.role, name: updatedUser.name, email: updatedUser.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: updatedUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

module.exports = {
  register,
  login,
  updateProfile
};
