const RECIPES_URL = "data/recipes.json";
const FAVORITES_KEY = "favoriteRecipes";

const allRecipesContainer = document.getElementById("all-recipes");
const favoriteRecipesContainer = document.getElementById("favorite-recipes");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

let allRecipes = [];

// ==== Load Recipes and Initialize ====
async function loadRecipes() {
  try {
    const response = await fetch(RECIPES_URL);
    const data = await response.json();
    allRecipes = data;

    renderAllRecipes(data);
    renderFavoriteRecipes(data);
  } catch (error) {
    console.error("Failed to load recipes:", error);
  }
}

// ==== Render All Recipes ====
function renderAllRecipes(recipes) {
  allRecipesContainer.innerHTML = "";
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    allRecipesContainer.appendChild(card);
  });
}

// ==== Render Favorite Recipes ====
function renderFavoriteRecipes(recipes) {
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const favoriteItems = recipes.filter(recipe => favorites.includes(recipe.id));

  favoriteRecipesContainer.innerHTML = "";

  if (favoriteItems.length === 0) {
    favoriteRecipesContainer.innerHTML = "<p>No favorites yet. Click ❤️ to add some!</p>";
    return;
  }

  favoriteItems.forEach(recipe => {
    const card = createRecipeCard(recipe);
    favoriteRecipesContainer.appendChild(card);
  });
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
    <p>${Array.isArray(recipe.instructions) ? recipe.instructions.join(" ") : recipe.instructions}</p>
    <button class="close-btn">Close</button>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.close();
    modal.remove();
  });
}

// ==== Toggle Favorite ====
function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavoriteRecipes(allRecipes); // Refresh favorites
}

// ==== Filter and Search Logic ====
function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = allRecipes.filter(recipe => {
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchValue);
    return matchesCategory && matchesSearch;
  });

  renderAllRecipes(filtered);
}

// ==== Event Listeners ====
categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// ==== Init ====
loadRecipes();
