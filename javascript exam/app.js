// JavaScript code for Recipe Book Application
document.getElementById("recipeForm").addEventListener("submit", addRecipe);
document.getElementById("searchTitle").addEventListener("input", searchAndFilter);
document.getElementById("searchIngredients").addEventListener("input", searchAndFilter);
document.getElementById("filterCuisine").addEventListener("change", searchAndFilter);

// Load recipes from local storage on page load
document.addEventListener("DOMContentLoaded", displayRecipes);

// Functions
function addRecipe(event) {
  event.preventDefault();
  const title = document.getElementById("recipeTitle").value;
  const ingredients = document.getElementById("recipeIngredients").value;
  const instructions = document.getElementById("recipeInstructions").value;
  const cuisine = document.getElementById("recipeCuisine").value;

  if (!title || !ingredients) {
    alert("Title and Ingredients are required!");
    return;
  }

  const recipe = {
    id: Date.now(),
    title,
    ingredients: ingredients.split(",").map(ing => ing.trim()),
    instructions,
    cuisine,
  };

  saveRecipe(recipe);
  displayRecipes();
  document.getElementById("recipeForm").reset();
}

function displayRecipes() {
  const recipes = loadRecipes();
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach(recipe => {
    const recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = `
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
      <button onclick="editRecipe(${recipe.id})">Edit</button>
      <button onclick="deleteRecipe(${recipe.id})">Delete</button>
    `;
    recipeList.appendChild(recipeDiv);
  });
}

function loadRecipes() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}

function saveRecipe(recipe) {
  const recipes = loadRecipes();
  recipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function deleteRecipe(id) {
  let recipes = loadRecipes();
  recipes = recipes.filter(recipe => recipe.id !== id);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayRecipes();
}

function editRecipe(id) {
  const recipes = loadRecipes();
  const recipe = recipes.find(recipe => recipe.id === id);

  if (recipe) {
    document.getElementById("recipeTitle").value = recipe.title;
    document.getElementById("recipeIngredients").value = recipe.ingredients.join(", ");
    document.getElementById("recipeInstructions").value = recipe.instructions;
    document.getElementById("recipeCuisine").value = recipe.cuisine;

    deleteRecipe(id); // Remove the old version
  }
}

function searchAndFilter() {
  const title = document.getElementById("searchTitle").value.toLowerCase();
  const ingredients = document.getElementById("searchIngredients").value.toLowerCase();
  const cuisine = document.getElementById("filterCuisine").value;

  const recipes = loadRecipes().filter(recipe => {
    const matchesTitle = recipe.title.toLowerCase().includes(title);
    const matchesIngredients = recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredients));
    const matchesCuisine = cuisine ? recipe.cuisine === cuisine : true;

    return matchesTitle && matchesIngredients && matchesCuisine;
  });

  displayFilteredRecipes(recipes);
}

function displayFilteredRecipes(filteredRecipes) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  filteredRecipes.forEach(recipe => {
    const recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = `
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
    `;
    recipeList.appendChild(recipeDiv);
  });
}
