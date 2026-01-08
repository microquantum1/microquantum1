// ============ CONFIGURATION ============
const API_BASE = 'http://localhost:3000/api';
let currentTheme = localStorage.getItem('theme') || 'light';
let isLoaded = false;

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Application initialized');
  
  // Apply saved theme
  applyTheme(currentTheme);
  
  // Load all data on page load
  loadAllData();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.getElementById('search-input').focus();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });
});

// ============ THEME MANAGEMENT ============
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  const body = document.body;
  const themeBtn = document.querySelector('.theme-toggle');
  
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark-mode');
    themeBtn.textContent = '🌙';
  }
}

// ============ NAVIGATION ============
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.nav-links').classList.remove('active');
  }
}

// ============ DATA LOADING ============
async function loadAllData() {
  try {
    // Load services
    loadServices();
    
    // Load team
    loadTeam();
    
    // Load projects
    loadProjects();
    
    // Load testimonials
    loadTestimonials();
    
    // Load blog
    loadBlog();
    
    // Load stats
    loadStats();
    
    isLoaded = true;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// ============ SERVICES ============
async function loadServices() {
  try {
    const response = await fetch(`${API_BASE}/services`);
    const data = await response.json();
    
    const grid = document.getElementById('services-grid');
    grid.innerHTML = data.services.map(service => `
      <div class="service-card" onclick="highlightService(this)">
        <span class="service-icon">${service.icon}</span>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <div class="service-price">${service.price}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function highlightService(element) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.borderColor = '';
  });
  element.style.borderColor = '#3498db';
}

// ============ PROJECTS/PORTFOLIO ============
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`);
    const data = await response.json();
    
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = data.projects.map(project => `
      <div class="project-card">
        <div class="project-image">${project.image}</div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <span class="project-category">${project.category}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// ============ TEAM ============
async function loadTeam() {
  try {
    const response = await fetch(`${API_BASE}/team`);
    const data = await response.json();
    
    const grid = document.getElementById('team-grid');
    grid.innerHTML = data.team.map(member => `
      <div class="team-member">
        <div class="member-avatar">${member.image}</div>
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading team:', error);
  }
}

// ============ TESTIMONIALS ============
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_BASE}/testimonials`);
    const data = await response.json();
    
    const carousel = document.getElementById('testimonials-carousel');
    carousel.innerHTML = data.testimonials.map(testimonial => `
      <div class="testimonial-card">
        <div class="stars">${'⭐'.repeat(testimonial.rating)}</div>
        <p class="testimonial-message">"${testimonial.message}"</p>
        <div class="testimonial-author">${testimonial.name}</div>
        <div class="testimonial-company">${testimonial.company}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

async function submitTestimonial(event) {
  event.preventDefault();
  
  const name = document.getElementById('testi-name').value;
  const company = document.getElementById('testi-company').value;
  const message = document.getElementById('testi-message').value;
  const rating = parseInt(document.getElementById('testi-rating').value);
  
  try {
    const response = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, message, rating })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Thank you for your review! ⭐');
      event.target.reset();
      loadTestimonials();
    }
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    alert('Error submitting testimonial');
  }
}

// ============ BLOG ============
async function loadBlog() {
  try {
    const response = await fetch(`${API_BASE}/blog`);
    const data = await response.json();
    
    const grid = document.getElementById('blog-grid');
    grid.innerHTML = data.posts.map(post => `
      <div class="blog-card">
        <div class="blog-header">
          <div class="blog-date">${formatDate(post.date)}</div>
          <div class="blog-title">${post.title}</div>
        </div>
        <div class="blog-content">
          <p class="blog-excerpt">${post.excerpt}</p>
          <div class="blog-author">By ${post.author}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading blog:', error);
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ============ STATS ============
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    const stats = await response.json();
    
    animateCountUp('stat-projects', stats.projectsCompleted);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function animateCountUp(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    element.querySelector('h3').textContent = current + '+';
  }, 20);
}

// ============ NEWSLETTER ============
async function subscribeNewsletter(event) {
  event.preventDefault();
  
  const email = document.getElementById('newsletter-email').value;
  const responseDiv = document.getElementById('newsletter-response');
  
  try {
    const response = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      responseDiv.innerHTML = `<p style="color: #2ecc71;">✅ ${data.message}</p>`;
      document.getElementById('newsletter-email').value = '';
    } else {
      responseDiv.innerHTML = `<p style="color: #e74c3c;">❌ ${data.error}</p>`;
    }
    
    setTimeout(() => {
      responseDiv.innerHTML = '';
    }, 3000);
  } catch (error) {
    console.error('Error:', error);
    responseDiv.innerHTML = '<p style="color: #e74c3c;">❌ Error subscribing</p>';
  }
}

// ============ CONTACT FORM ============
async function submitContact(event) {
  event.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  
  const responseDiv = document.getElementById('contact-response');
  
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message })
    });
    
    const data = await response.json();
    
    if (data.success) {
      responseDiv.innerHTML = `<div style="background-color: #2ecc71; color: white; padding: 1rem; border-radius: 5px;">✅ ${data.message}</div>`;
      event.target.reset();
    } else {
      responseDiv.innerHTML = `<div style="background-color: #e74c3c; color: white; padding: 1rem; border-radius: 5px;">❌ ${data.error}</div>`;
    }
    
    setTimeout(() => {
      responseDiv.innerHTML = '';
    }, 5000);
  } catch (error) {
    console.error('Error:', error);
    responseDiv.innerHTML = '<div style="background-color: #e74c3c; color: white; padding: 1rem; border-radius: 5px;">❌ Error sending message</div>';
  }
}

// ============ SEARCH ============
async function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    const modal = document.getElementById('search-modal');
    const resultsDiv = document.getElementById('search-results');
    
    if (data.results.length === 0) {
      resultsDiv.innerHTML = '<p>No results found for "' + query + '"</p>';
    } else {
      resultsDiv.innerHTML = data.results.map(result => `
        <div class="search-result-item">
          <strong>${result.title || result.name}</strong>
          <p>${result.description || result.excerpt || result.message || ''}</p>
        </div>
      `).join('');
    }
    
    modal.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert('Error performing search');
  }
}

function closeSearch() {
  document.getElementById('search-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('search-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// ============ ADMIN PANEL ============
function showAdminPanel() {
  const panel = document.getElementById('admin-dashboard');
  panel.style.display = 'block';
  loadAdminData();
}

function closeAdmin() {
  document.getElementById('admin-dashboard').style.display = 'none';
}

async function loadAdminData() {
  try {
    const response = await fetch(`${API_BASE}/admin/dashboard`);
    const data = await response.json();
    
    document.getElementById('admin-contacts').textContent = data.totalContacts;
    document.getElementById('admin-subscribers').textContent = data.totalSubscribers;
    document.getElementById('admin-projects').textContent = data.totalProjects;
    document.getElementById('admin-testimonials').textContent = data.totalTestimonials;
    
    const recentDiv = document.getElementById('admin-recent-contacts');
    if (data.recentContacts.length > 0) {
      recentDiv.innerHTML = data.recentContacts.map(contact => `
        <div class="contact-item">
          <strong>${contact.name}</strong> - ${contact.email}<br>
          <small>${contact.subject}</small>
        </div>
      `).join('');
    } else {
      recentDiv.innerHTML = '<p>No recent contacts</p>';
    }
  } catch (error) {
    console.error('Error loading admin data:', error);
  }
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+A to open admin panel
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    showAdminPanel();
  }
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============ LAZY LOADING ============
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.service-card, .project-card, .team-member').forEach(el => {
  el.style.opacity = '0.7';
  imageObserver.observe(el);
});

console.log('💡 Tip: Press Ctrl+Shift+A to open the admin panel!');
