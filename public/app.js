const fetchRecipes = async () => {
    try {
        const response = await fetch('/api/recipes');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
};

const displayRecipes = (recipes) => {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear existing recipes

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.innerHTML = `
            <h3>${escapeHtml(recipe.title)}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients ? escapeHtml(recipe.ingredients.join(', ')) : 'No ingredients listed'}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions ? escapeHtml(recipe.instructions) : 'No instructions provided'}</p>
            <p><strong>Cooking Time:</strong> ${recipe.cookingTime || 'Not specified'} minutes</p>
            <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
            <button onclick="editRecipeForm('${recipe._id}', '${escapeHtml(recipe.title)}', '${escapeHtml(recipe.ingredients.join(','))}', '${escapeHtml(recipe.instructions)}', ${recipe.cookingTime})">Edit</button>
        `;
        recipeList.appendChild(recipeElement);
    });
};

const editRecipeForm = (id, title, ingredients, instructions, cookingTime) => {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-ingredients').value = ingredients;
    document.getElementById('edit-instructions').value = instructions;
    document.getElementById('edit-cookingTime').value = cookingTime;

    document.getElementById('edit-form').style.display = 'block'; // Show the form
};

const editRecipe = async (id) => {
    const updatedRecipe = {
        title: document.getElementById('edit-title').value,
        ingredients: document.getElementById('edit-ingredients').value.split(',').map(ingredient => ingredient.trim()),
        instructions: document.getElementById('edit-instructions').value,
        cookingTime: parseInt(document.getElementById('edit-cookingTime').value, 10),
    };

    try {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecipe),
        });

        if (response.ok) {
            fetchRecipes(); // Refresh the list of recipes to show the update
            document.getElementById('edit-form').style.display = 'none'; // Hide the form after successful update
        } else {
            throw new Error('Failed to update the recipe');
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
    }
};

const deleteRecipe = async (id) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
        try {
            const response = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
            await response.json();
            fetchRecipes();
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes();

    const addForm = document.getElementById('add-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newRecipe = {
                title: document.getElementById('add-title').value,
                ingredients: document.getElementById('add-ingredients').value.split(',').map(ingredient => ingredient.trim()),
                instructions: document.getElementById('add-instructions').value,
                cookingTime: parseInt(document.getElementById('add-cookingTime').value, 10),
            };

            try {
                const response = await fetch('/api/recipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecipe),
                });

                if (response.ok) {
                    fetchRecipes();
                } else {
                    console.error('Failed to add a new recipe');
                }
            } catch (error) {
                console.error('Error adding new recipe:', error);
            }
        });
    }

    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value; // Get the id from the hidden input field
        editRecipe(id); // Call the editRecipe function with the id
    });
});

const escapeHtml = (text) => {
    return text
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
