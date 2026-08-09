// =============================================
//  USER ROUTES
//  Base URL: /api/users
// =============================================
 
const express = require('express');
const router  = express.Router();
 
// Temporary in-memory storage (until Module 4 adds a real database)
let users = [];
 
// ---- REGISTER ----
// POST /api/users/register
router.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;
 
  // Basic validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
 
  // Check if email already exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered.' });
  }
 
  // Save user (plain text password for now — Module 6 adds hashing)
  const newUser = {
    id: Date.now().toString(),
    name,
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };
 
  users.push(newUser);
 
  res.status(201).json({
    message: 'User registered successfully!',
    user: { id: newUser.id, name, username, email }
  });
});
 
// ---- LOGIN ----
// POST /api/users/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
 
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
 
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
 
  res.status(200).json({
    message: 'Login successful!',
    user: { id: user.id, name: user.name, username: user.username, email: user.email }
  });
});
 
// ---- GET ALL USERS (for testing only) ----
// GET /api/users
router.get('/', (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id, name: u.name, username: u.username, email: u.email
  }));
  res.json(safeUsers);
});
 
module.exports = router;