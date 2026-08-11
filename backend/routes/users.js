// =============================================
//  USER ROUTES - Module 4 (Supabase)
//  Base URL: /api/users
// =============================================
 
const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');
 
// ---- REGISTER ----
// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
 
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
 
  // Check if email already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
 
  if (existing) {
    return res.status(400).json({ error: 'Email already registered.' });
  }
 
  // Insert new user into Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, username, email, password }])
    .select()
    .single();
 
  if (error) {
    return res.status(500).json({ error: error.message });
  }
 
  res.status(201).json({
    message: 'User registered successfully!',
    user: { id: data.id, name: data.name, username: data.username, email: data.email }
  });
});
 
// ---- LOGIN ----
// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
 
  // Find user in Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
 
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
 
  res.status(200).json({
    message: 'Login successful!',
    user: { id: user.id, name: user.name, username: user.username, email: user.email }
  });
});
 
// ---- GET ALL USERS ----
// GET /api/users
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, email, created_at');
 
  if (error) {
    return res.status(500).json({ error: error.message });
  }
 
  res.json(data);
});
 
module.exports = router;