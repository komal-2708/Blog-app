const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email
  };
}

function createToken(user) {
  return jwt.sign(
    publicUser(user),
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// REGISTER
router.post('/register', async (req, res) => {
  const name = req.body.name?.trim();
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      error: 'Username must be at least 3 characters.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters.'
    });
  }

  const { data: existingEmail, error: emailError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailError) {
    return res.status(500).json({ error: emailError.message });
  }

  if (existingEmail) {
    return res.status(409).json({
      error: 'This email is already registered.'
    });
  }

  const { data: existingUsername, error: usernameError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (usernameError) {
    return res.status(500).json({ error: usernameError.message });
  }

  if (existingUsername) {
    return res.status(409).json({
      error: 'This username is already taken.'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabase
    .from('users')
    .insert([{ name, username, email, password: hashedPassword }])
    .select('id, name, username, email')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const token = createToken(user);

  return res.status(201).json({
    message: 'Registration successful!',
    token,
    user: publicUser(user)
  });
});

// LOGIN
router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required.'
    });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, username, email, password')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!user) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    });
  }

  const isOldPlainTextPassword = !user.password.startsWith('$2');

  const validPassword = isOldPlainTextPassword
    ? password === user.password
    : await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    });
  }

  // Converts any old Module 4 plaintext password to a secure bcrypt hash.
  if (isOldPlainTextPassword) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }
  }

  const token = createToken(user);

  return res.json({
    message: 'Login successful!',
    token,
    user: publicUser(user)
  });
});

// GET LOGGED-IN USER
router.get('/me', requireAuth, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, username, email')
    .eq('id', req.user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({ user });
});

module.exports = router;