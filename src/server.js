const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data storage
const data = {
  contacts: [],
  newsletter: [],
  testimonials: [
    { id: 1, name: 'Sarah Johnson', company: 'Tech Corp', message: 'Amazing service and support!', rating: 5 },
    { id: 2, name: 'Michael Chen', company: 'Innovation Labs', message: 'Professional and reliable team.', rating: 5 },
    { id: 3, name: 'Emma Wilson', company: 'Digital Solutions', message: 'Best decision for our business!', rating: 5 }
  ],
  projects: [
    { id: 1, title: 'E-Commerce Platform', description: 'Built a scalable e-commerce solution', image: '🛒', category: 'Web Development' },
    { id: 2, title: 'Mobile App Launch', description: 'Delivered a high-performance mobile app', image: '📱', category: 'Mobile Development' },
    { id: 3, title: 'AI Analytics Dashboard', description: 'Created advanced analytics with AI', image: '📊', category: 'Data Analytics' },
    { id: 4, title: 'Cloud Migration', description: 'Successfully migrated to cloud infrastructure', image: '☁️', category: 'Infrastructure' }
  ],
  team: [
    { id: 1, name: 'John Smith', role: 'CEO & Founder', image: '👔' },
    { id: 2, name: 'Sarah Davis', role: 'CTO', image: '👩‍💼' },
    { id: 3, name: 'Mike Johnson', role: 'Lead Developer', image: '👨‍💻' },
    { id: 4, name: 'Lisa Anderson', role: 'Designer', image: '🎨' }
  ],
  services: [
    { id: 1, title: 'Web Development', description: 'Custom web solutions', icon: '🌐', price: '$2,999' },
    { id: 2, title: 'Mobile Apps', description: 'iOS & Android development', icon: '📱', price: '$3,999' },
    { id: 3, title: 'Cloud Solutions', description: 'Scalable infrastructure', icon: '☁️', price: '$1,999' },
    { id: 4, title: 'AI & ML', description: 'Machine learning solutions', icon: '🤖', price: '$4,999' },
    { id: 5, title: 'Data Analytics', description: 'Business intelligence tools', icon: '📊', price: '$2,499' },
    { id: 6, title: 'Consulting', description: 'Expert advice', icon: '💼', price: '$1,499' }
  ],
  blog: [
    { id: 1, title: 'Future of Web Development', date: '2024-01-08', excerpt: 'Exploring the latest trends in web development...', author: 'John Smith' },
    { id: 2, title: 'Cloud Migration Guide', date: '2024-01-07', excerpt: 'Best practices for migrating to the cloud...', author: 'Sarah Davis' },
    { id: 3, title: 'AI in Business', date: '2024-01-06', excerpt: 'How artificial intelligence is transforming businesses...', author: 'Mike Johnson' }
  ]
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ============ SERVICES API ============
app.get('/api/services', (req, res) => {
  res.json({ services: data.services });
});

// ============ TEAM API ============
app.get('/api/team', (req, res) => {
  res.json({ team: data.team });
});

// ============ PROJECTS/PORTFOLIO API ============
app.get('/api/projects', (req, res) => {
  res.json({ projects: data.projects });
});

app.post('/api/projects', (req, res) => {
  const { title, description, category } = req.body;
  const newProject = {
    id: data.projects.length + 1,
    title,
    description,
    category,
    image: '📁'
  };
  data.projects.push(newProject);
  res.json({ success: true, project: newProject });
});

// ============ TESTIMONIALS API ============
app.get('/api/testimonials', (req, res) => {
  res.json({ testimonials: data.testimonials });
});

app.post('/api/testimonials', (req, res) => {
  const { name, company, message, rating } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const newTestimonial = {
    id: uuidv4(),
    name,
    company: company || 'Anonymous',
    message,
    rating: Math.min(5, Math.max(1, rating || 5))
  };
  
  data.testimonials.push(newTestimonial);
  res.json({ success: true, testimonial: newTestimonial });
});

// ============ CONTACT FORM API ============
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const contact = {
    id: uuidv4(),
    name,
    email,
    phone: phone || 'Not provided',
    subject: subject || 'General Inquiry',
    message,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  data.contacts.push(contact);
  
  // Simulate sending email
  console.log(`📧 New contact: ${name} (${email})`);
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message! We will get back to you soon.',
    id: contact.id
  });
});

app.get('/api/contacts', (req, res) => {
  res.json({ contacts: data.contacts, total: data.contacts.length });
});

// ============ NEWSLETTER API ============
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (data.newsletter.includes(email)) {
    return res.status(400).json({ error: 'Email already subscribed' });
  }

  data.newsletter.push(email);
  
  res.json({ 
    success: true, 
    message: 'Successfully subscribed to our newsletter!',
    subscribers: data.newsletter.length
  });
});

// ============ BLOG API ============
app.get('/api/blog', (req, res) => {
  res.json({ posts: data.blog });
});

app.get('/api/blog/:id', (req, res) => {
  const post = data.blog.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// ============ STATS API ============
app.get('/api/stats', (req, res) => {
  res.json({
    projects: data.projects.length,
    teamMembers: data.team.length,
    clients: Math.floor(Math.random() * 100) + 50,
    yearsExperience: 10,
    projectsCompleted: data.projects.length + 20,
    satisfaction: 98
  });
});

// ============ SEARCH API ============
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  
  if (!query) {
    return res.json({ results: [] });
  }

  const results = [
    ...data.services.filter(s => s.title.toLowerCase().includes(query)),
    ...data.projects.filter(p => p.title.toLowerCase().includes(query)),
    ...data.blog.filter(b => b.title.toLowerCase().includes(query))
  ];

  res.json({ results, count: results.length });
});

// ============ ADMIN API ============
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    totalContacts: data.contacts.length,
    totalSubscribers: data.newsletter.length,
    totalProjects: data.projects.length,
    recentContacts: data.contacts.slice(-5),
    totalTestimonials: data.testimonials.length
  });
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
