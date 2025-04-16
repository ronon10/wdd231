// script.js

const recipeList = document.getElementById("recipe-list");
const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");

let allRecipes = [];

// Função assíncrona para carregar receitas de um JSON (local ou via API)
async function loadRecipes() {
  try {
    const response = await fetch("data/recipes.json");
    const data = await response.json();
    allRecipes = data.recipes.slice(0, 15);
    displayRecipes(allRecipes);
    populateCategoryFilter(allRecipes);
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
  }
}

function displayRecipes(recipes) {
  recipeList.innerHTML = "";
  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
      <h3>${recipe.title}</h3>
      <button class="details-btn" data-id="${recipe.id}">Ver detalhes</button>
      <button class="favorite-btn" data-id="${recipe.id}">❤️</button>
    `;

    recipeList.appendChild(card);
  });

  document.querySelectorAll(".details-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const recipe = allRecipes.find((r) => r.id == id);
      openModal(recipe);
    })
  );

  document.querySelectorAll(".favorite-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      toggleFavorite(id);
    })
  );
}

function openModal(recipe) {
  modalContent.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}">
    <p><strong>Categoria:</strong> ${recipe.category}</p>
    <p><strong>Ingredientes:</strong></p>
    <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <p><strong>Instruções:</strong></p>
    <p>${recipe.instructions}</p>
  `;
  recipeModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  recipeModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target == recipeModal) {
    recipeModal.style.display = "none";
  }
});

function populateCategoryFilter(recipes) {
  const categories = [...new Set(recipes.map((r) => r.category))];
  categoryFilter.innerHTML =
    `<option value="">Todas as categorias</option>` +
    categories
      .map((cat) => `<option value="${cat}">${cat}</option>`)
      .join("");
}

categoryFilter.addEventListener("change", () => {
  filterAndSearch();
});

searchInput.addEventListener("input", () => {
  filterAndSearch();
});

function filterAndSearch() {
  const category = categoryFilter.value.toLowerCase();
  const search = searchInput.value.toLowerCase();

  const filtered = allRecipes.filter((recipe) => {
    const matchesCategory = category === "" || recipe.category.toLowerCase() === category;
    const matchesSearch = recipe.title.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  displayRecipes(filtered);
}

function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Recipe uploaded in favorits!");
}

// Formulário de envio de receita
const form = document.getElementById("recipe-form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.title.value;
  const image = form.image.value;
  const category = form.category.value;
  const ingredients = form.ingredients.value.split(",");
  const instructions = form.instructions.value;

  const newRecipe = {
    id: Date.now(),
    title,
    image,
    category,
    ingredients,
    instructions
  };

  allRecipes.push(newRecipe);
  displayRecipes(allRecipes);
  form.reset();
  alert("Recipes was sended with success!");
});

// Iniciar
loadRecipes();
