// server/src/services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById } from '../models/user.model.js';

export const loginService = async (email, password) => {
  const result = await findUserByEmail(email);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};

export const registerService = async (userData) => {
  const { firstName, lastName, email, password } = userData;
  
  const existingUser = await findUserByEmail(email);
  if (existingUser.rows.length > 0) {
    throw new Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await createUser({
    firstName,
    lastName,
    username: email, // use email as username
    email,
    password: hashedPassword
  });

  const user = result.rows[0];
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user, token };
};

export const findUserByIdService = async (id) => {
  const result = await findUserById(id);
  return result.rows[0];
};
