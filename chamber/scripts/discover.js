document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("visitMessage");
  
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
  
    if (lastVisit) {
      const diffDays = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        messageElement.textContent = "Welcome back! You already visited today.";
      } else {
        messageElement.textContent = `Welcome back! Your last visit was ${diffDays} day(s) ago.`;
      }
    } else {
      messageElement.textContent = "Welcome! This is your first visit.";
    }
  
    localStorage.setItem("lastVisit", now);
  
    fetch("data/points.json")
      .then(res => res.json())
      .then(points => {
        const container = document.getElementById("discoverGrid");
        points.forEach((point, index) => {
          const card = document.createElement("div");
          card.classList.add("discover-card");
          card.style.gridArea = String.fromCharCode(97 + index); // 'a', 'b', 'c'...
  
          card.innerHTML = `
            <img src="${point.image}" alt="${point.name}">
            <h3>${point.name}</h3>
            <p>${point.description}</p>
          `;
          container.appendChild(card);
        });
      })
      .catch(error => console.error("Error loading points:", error));
  });
  