document.addEventListener("DOMContentLoaded", () => {
    updateWeather();
    loadSpotlights();
    loadMembers();
    updateFooter();
    const membersContainer = document.getElementById("members-container");
    const toggleButton = document.getElementById("toggleView");
    let isGridView = true;

});

function updateWeather() {
    const apiKey = 'a252501f4520ab1948f320ec19b044ac'; // API Key
    const city = 'Guarulhos,BR'; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found or request error');
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather data:", data);

            const tempElement = document.getElementById("current-temp");
            const conditionElement = document.getElementById("weather-condition");
            const forecastContainer = document.getElementById("forecast");
            const cityNameElement = document.getElementById("city-name");

            
            if (cityNameElement) {
                cityNameElement.textContent = data.city.name;
            }

            
            if (tempElement && conditionElement) {
                const temperature = data.list[0].main.temp.toFixed(1);
                const weatherDescription = data.list[0].weather[0].description;
                tempElement.textContent = `${temperature}°C`;
                conditionElement.textContent = weatherDescription;
            }

            
            if (forecastContainer) {
                forecastContainer.innerHTML = "";  
                for (let i = 0; i < 3; i++) {
                    const dayForecast = data.list[i * 8]; 
                    const dayCard = document.createElement("div");
                    dayCard.classList.add("forecast-card");
                    dayCard.innerHTML = `
                        <h3>Day ${i + 1}</h3>
                        <p>Temp: ${dayForecast.main.temp.toFixed(1)}°C</p>
                        <p>${dayForecast.weather[0].description}</p>
                    `;
                    forecastContainer.appendChild(dayCard);
                }
            }

           
            const weatherContainer = document.getElementById("weather-container");
            if (weatherContainer) {
                weatherContainer.innerHTML = "";
            }

        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            const weatherContainer = document.getElementById("weather-container");
            if (weatherContainer) {
                weatherContainer.innerHTML = `<p>Error loading weather. Please try again later.</p>`;
            }
        });
}




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



function loadSpotlights() {
    fetch('data/members.json') // Certifique-se de que o caminho para o arquivo JSON está correto
        .then(response => response.json())
        .then(data => {
            console.log("Dados dos membros:", data);

            // Filtra apenas membros de nível Gold ou Silver
            const members = data.filter(member => member.membership_level === 'Gold' || member.membership_level === 'Silver');
            
            // Embaralha os membros e seleciona 2 ou 3 aleatórios
            const shuffled = members.sort(() => 0.5 - Math.random()).slice(0, 3);

            const spotlightContainer = document.getElementById("spotlight-container");
            if (spotlightContainer) {
                spotlightContainer.innerHTML = ""; // Limpa qualquer conteúdo anterior

                // Cria e exibe os cartões de destaque para os membros filtrados
                shuffled.forEach(member => {
                    const card = document.createElement("div");
                    card.classList.add("spotlight-card");

                    // Preenche o conteúdo do cartão com as informações dos membros
                    card.innerHTML = `
                        <h3>${member.name}</h3>
                        <img src="${member.image}" alt="${member.name} logo" class="spotlight-logo">
                        <p>📞 ${member.phone}</p>
                        <p>📍 ${member.address}</p>
                        <a href="${member.website}" target="_blank">🌐 Visit Website</a>
                        <p class="membership-level">${member.membership_level} Member</p>
                    `;

                    // Adiciona o cartão ao container de destaque
                    spotlightContainer.appendChild(card);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os destaques:", error);
        });
}



function loadMembers() {
    fetch('data/members.json')
        .then(response => response.json())
        .then(data => {
            if (!data || !data.members) {
                throw new Error("Estrutura do JSON inválida.");
            }
            const membersContainer = document.getElementById("members-container");
            if (!membersContainer) {
                console.error("Elemento #members-container não encontrado.");
                return;
            }
            displayMembers(data.members);
        })
        .catch(error => console.error("Erro ao carregar os membros:", error));
}

function displayMembers(members) {
    const membersContainer = document.getElementById("members-container");
    if (!membersContainer) return;
    
    membersContainer.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${member.name}</h3>
            <p>${member.industry}</p>
            <img src="${member.image}" alt="Imagem de ${member.name}" class="member-image">
            <p><a href="${member.website}" target="_blank">Visitar site</a></p>
        `;
        membersContainer.appendChild(card);
    });
}

function updateFooter() {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
}
