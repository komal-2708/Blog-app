
// =============================================
//  BLOG ROUTES - Module 5 (Full CRUD)
//  Base URL: /api/blogs
// =============================================
 
const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');
 
// ---- GET ALL PUBLISHED BLOGS (Home page) ----
// GET /api/blogs
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
 
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
 
// ---- GET ALL BLOGS INCLUDING DRAFTS (Dashboard) ----
// IMPORTANT: This must be BEFORE /:id route
// GET /api/blogs/all
router.get('/all', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });
 
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
 
// ---- GET SINGLE BLOG ----
// GET /api/blogs/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', req.params.id)
    .single();
 
  if (error || !data) return res.status(404).json({ error: 'Blog not found.' });
  res.json(data);
});
 
// ---- CREATE BLOG ----
// POST /api/blogs
router.post('/', async (req, res) => {
  const { title, category, body, status, author } = req.body;
 
  if (!title || !category || !body) {
    return res.status(400).json({ error: 'Title, category, and content are required.' });
  }
 
  const { data, error } = await supabase
    .from('blogs')
    .insert([{
      title,
      category,
      body,
      status: status || 'published',
      author: author || 'Anonymous'
    }])
    .select()
    .single();
 
  if (error) return res.status(500).json({ error: error.message });
 
  res.status(201).json({ message: 'Blog created successfully!', blog: data });
});
 
// ---- UPDATE BLOG ----
// PUT /api/blogs/:id
router.put('/:id', async (req, res) => {
  const { title, category, body, status } = req.body;
 
  const { data, error } = await supabase
    .from('blogs')
    .update({ title, category, body, status, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
 
  if (error || !data) return res.status(404).json({ error: 'Blog not found or update failed.' });
 
  res.json({ message: 'Blog updated successfully!', blog: data });
});
 
// ---- DELETE BLOG ----
// DELETE /api/blogs/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', req.params.id);
 
  if (error) return res.status(500).json({ error: error.message });
 
  res.json({ message: 'Blog deleted successfully!' });
});
 
module.exports = router;
 
