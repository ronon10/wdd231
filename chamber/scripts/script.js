document.addEventListener("DOMContentLoaded", () => {
    const membersContainer = document.getElementById("members-container");
    const toggleButton = document.getElementById("toggleView");
    let isGridView = true;

    fetch("data/members.json")
        .then(response => response.json())
        .then(data => displayMembers(data))
        .catch(error => console.error("Error loading data:", error));

    function displayMembers(members) {
        membersContainer.innerHTML = "";
        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("card");
            
            card.innerHTML = `
                <h3>${member.name}</h3>
                <p>${member.industry}</p>
                <img src="${member.image}" alt="Image of ${member.name}" class="member-image">
                <p><a href="${member.website}" target="_blank">Visit website</a></p>
            `;
            membersContainer.appendChild(card);
        });
    }

    toggleButton.addEventListener("click", () => {
        isGridView = !isGridView;
        membersContainer.classList.toggle("list-view", !isGridView);
    });

    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
});
