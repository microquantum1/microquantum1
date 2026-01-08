// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Get greeting from backend
async function getGreeting() {
  try {
    const response = await fetch(`${API_BASE}/hello`);
    const data = await response.json();
    
    const resultDiv = document.getElementById('greeting-result');
    resultDiv.innerHTML = `
      <h3>Response from Backend:</h3>
      <p><strong>Message:</strong> ${data.message}</p>
      <p><strong>Timestamp:</strong> ${data.timestamp}</p>
    `;
    resultDiv.classList.add('show');
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('greeting-result').innerHTML = `
      <p style="color: red;">Error: Could not reach backend. Make sure the server is running!</p>
    `;
    document.getElementById('greeting-result').classList.add('show');
  }
}

// Calculate function
async function calculate() {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  const operation = document.getElementById('operation').value;
  
  if (isNaN(num1) || isNaN(num2)) {
    alert('Please enter valid numbers');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ num1, num2, operation })
    });
    
    const data = await response.json();
    
    const resultDiv = document.getElementById('calc-result');
    resultDiv.innerHTML = `
      <h3>Calculation Result:</h3>
      <p><strong>Operation:</strong> ${data.operation}</p>
      <p><strong>Numbers:</strong> ${data.num1} and ${data.num2}</p>
      <p><strong>Result:</strong> <span style="font-size: 1.5em; color: #27ae60;">${data.result}</span></p>
    `;
    resultDiv.classList.add('show');
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('calc-result').innerHTML = `
      <p style="color: red;">Error: Could not perform calculation</p>
    `;
    document.getElementById('calc-result').classList.add('show');
  }
}

// Load data from backend
async function loadData() {
  try {
    const response = await fetch(`${API_BASE}/data`);
    const data = await response.json();
    
    const container = document.getElementById('data-container');
    container.innerHTML = '';
    
    data.users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'data-card';
      card.innerHTML = `
        <h3>User #${user.id}</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('data-container').innerHTML = `
      <p style="color: red;">Error: Could not load data. Make sure the server is running!</p>
    `;
  }
}

// Scroll to section
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded. Application ready!');
});
