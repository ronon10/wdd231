// ==== Global Constants ====
const featuredContainer = document.getElementById("featured-recipes");
const RECIPES_URL = "data/recipes.json";
const FAVORITES_KEY = "favoriteRecipes";

// ==== Load Featured Recipes ====
async function loadFeaturedRecipes() {
  try {
    const response = await fetch(RECIPES_URL);
    const data = await response.json();

    // Choose 3 random featured recipes
    const featured = data.sort(() => 0.5 - Math.random()).slice(0, 3);

    featured.forEach(recipe => {
      const card = createRecipeCard(recipe);
      featuredContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load recipes:", error);
  }
}

// ==== Create Recipe Card ====
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
    <div class="recipe-info">
      <h3>${recipe.title}</h3>
      <p><strong>Category:</strong> ${recipe.category}</p>
      <button class="details-btn" data-id="${recipe.id}">View Details</button>
      <button class="favorite-btn" data-id="${recipe.id}">❤️</button>
    </div>
  `;

  card.querySelector(".details-btn").addEventListener("click", () => openModal(recipe));
  card.querySelector(".favorite-btn").addEventListener("click", () => toggleFavorite(recipe.id));

  return card;
}

// ==== Modal Logic ====
function openModal(recipe) {
  const modal = document.createElement("dialog");
  modal.classList.add("modal");

  modal.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
    <p><strong>Category:</strong> ${recipe.category}</p>
    <p><strong>Ingredients:</strong></p>
    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    <p><strong>Instructions:</strong></p>
    <p>${recipe.instructions}</p>
    <button class="close-btn">Close</button>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.close();
    modal.remove();
  });
}

// ==== Favorite Toggle ====
function toggleFavorite(recipeId) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  if (favorites.includes(recipeId)) {
    favorites = favorites.filter(id => id !== recipeId);
  } else {
    favorites.push(recipeId);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// ==== Initialize ====
loadFeaturedRecipes();
