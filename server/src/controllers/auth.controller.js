import { loginService, registerService, findUserByIdService, updateUserProfile } from '../services/auth.service.js';

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

    const { user, token } = await registerService({ firstName, lastName, email, password });
    res.status(201).json({ message: 'User registered successfully', user, token });
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

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const updatedUser = await updateUserProfile(req.user.id, { firstName, lastName });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
