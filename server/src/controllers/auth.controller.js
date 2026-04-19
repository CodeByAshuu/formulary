import { loginService } from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const token = await loginService(username, password);
    res.json({ token, message: 'Logged in successfully' });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
