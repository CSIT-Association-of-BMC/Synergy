import { getClient } from '../config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  let client;
  try {
    const { username, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to PostgreSQL
    client = getClient()
    client.connect()

    // Check if user with the provided email or phone already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    const result = await client.query(
      'INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, phone, hashedPassword]
    );

    const user = result.rows[0];
    console.log(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client && client.end();
  }
};

export const loginUser = async (req, res) => {
    let client
    try {
      const { credential, password } = req.body;
  
      // Check if the credential is an email or username
      const isEmail = credential.includes('@');
      let query;
      const JWT_SECRET = process.env.JWT_SECRET
  
      client = getClient()
      client.connect()
      if (isEmail) {
        query = 'SELECT * FROM users WHERE email = $1';
      } else {
        query = 'SELECT * FROM users WHERE username = $1';
      }
  
      const result = await client.query(query, [credential]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client && client.end();
    }
  };
  