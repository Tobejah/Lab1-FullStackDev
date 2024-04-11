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
        const recipeElement = createRecipeElement(recipe);
        recipeList.appendChild(recipeElement);
    });
};

const createRecipeElement = (recipe) => {
    const { title, ingredients, instructions, cookingTime, _id } = recipe;
    const recipeElement = document.createElement('div');
    recipeElement.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p><strong>Ingredients:</strong> ${ingredients ? escapeHtml(ingredients.join(', ')) : 'No ingredients listed'}</p>
        <p><strong>Instructions:</strong> ${instructions ? escapeHtml(instructions) : 'No instructions provided'}</p>
        <p><strong>Cooking Time:</strong> ${cookingTime || 'Not specified'} minutes</p>
        <button onclick="deleteRecipe('${_id}')">Delete</button>
        <button onclick="editRecipeForm('${_id}', '${escapeHtml(title)}', '${escapeHtml(ingredients.join(','))}', '${escapeHtml(instructions)}', ${cookingTime})">Edit</button>
    `;
    return recipeElement;
};

const editRecipeForm = (id, title, ingredients, instructions, cookingTime) => {
    const fields = ['title', 'ingredients', 'instructions', 'cookingTime'];
    fields.forEach(field => {
        document.getElementById(`edit-${field}`).value = field === 'ingredients' ? ingredients : recipe[field];
    });

    document.getElementById('edit-form').style.display = 'block'; // Show the form
};

const editRecipe = async (id) => {
    const fields = ['title', 'ingredients', 'instructions', 'cookingTime'];
    const updatedRecipe = {};
    fields.forEach(field => {
        updatedRecipe[field] = document.getElementById(`edit-${field}`).value;
    });

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
            const newRecipe = {};
            const fields = ['title', 'ingredients', 'instructions', 'cookingTime'];
            fields.forEach(field => {
                newRecipe[field] = document.getElementById(`add-${field}`).value;
                if (field === 'ingredients') {
                    newRecipe[field] = newRecipe[field].split(',').map(ingredient => ingredient.trim());
                } else if (field === 'cookingTime') {
                    newRecipe[field] = parseInt(newRecipe[field], 10);
                }
            });

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
