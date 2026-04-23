// server/src/controllers/auth.controller.js
import { loginService, registerService, findUserByIdService } from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const token = await loginService(email, password);
    res.json({ token, message: 'Logged in successfully' });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await registerService({ firstName, lastName, email, password });
    res.status(201).json({ message: 'User registered successfully', user: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await findUserByIdService(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
