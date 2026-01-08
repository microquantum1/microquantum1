fetch("/api/company")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("service-list");
    data.services.forEach(service => {
      const div = document.createElement("div");
      div.textContent = service;
      list.appendChild(div);
    });
  });

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: e.target[0].value,
      email: e.target[1].value,
      message: e.target[2].value
    })
  });
  alert("Message sent successfully");
  e.target.reset();
});
