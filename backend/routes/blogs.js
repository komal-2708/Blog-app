const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// GET ALL PUBLISHED BLOGS — public Home page
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// GET ONLY LOGGED-IN USER'S POSTS — protected Dashboard
router.get('/mine', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// GET ONE PUBLISHED BLOG
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', req.params.id)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({
      error: 'Blog not found.'
    });
  }

  return res.json(data);
});

// CREATE BLOG — protected
router.post('/', requireAuth, async (req, res) => {
  const { title, category, body, status } = req.body;

  if (!title?.trim() || !category || !body?.trim()) {
    return res.status(400).json({
      error: 'Title, category, and content are required.'
    });
  }

  if (!['published', 'draft'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid post status.'
    });
  }

  const { data, error } = await supabase
    .from('blogs')
    .insert([
      {
        title: title.trim(),
        category,
        body: body.trim(),
        status,
        author: req.user.name || req.user.username,
        user_id: req.user.id
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    message: 'Blog created successfully!',
    blog: data
  });
});

// UPDATE ONLY LOGGED-IN USER'S OWN BLOG
router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, body, status } = req.body;

  if (
    !title?.trim() ||
    !category ||
    !body?.trim() ||
    !['published', 'draft'].includes(status)
  ) {
    return res.status(400).json({
      error: 'Title, category, content, and a valid status are required.'
    });
  }

  const { data, error } = await supabase
    .from('blogs')
    .update({
      title: title.trim(),
      category,
      body: body.trim(),
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({
      error: 'Blog not found or you do not have permission to edit it.'
    });
  }

  return res.json({
    message: 'Blog updated successfully!',
    blog: data
  });
});

// DELETE ONLY LOGGED-IN USER'S OWN BLOG
router.delete('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select('id')
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({
      error: 'Blog not found or you do not have permission to delete it.'
    });
  }

  return res.json({
    message: 'Blog deleted successfully!'
  });
});

module.exports = router;