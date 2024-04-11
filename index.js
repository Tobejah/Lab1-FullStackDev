import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { getAllRecipes, getRecipeByTitle, createRecipe, updateRecipe, deleteRecipe } from './controllers/recipeController.js';

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors()); // Enable CORS
app.use(express.static('public')); // Serve static files

const recipeRoutes = express.Router();

// Define routes
recipeRoutes.get('/api/recipes', getAllRecipes);
recipeRoutes.get('/api/recipes/:title', getRecipeByTitle);
recipeRoutes.post('/api/recipes', createRecipe);
recipeRoutes.put('/api/recipes/:id', updateRecipe);
recipeRoutes.delete('/api/recipes/:id', deleteRecipe);

// Use the recipeRoutes
app.use('/', recipeRoutes);

// Additional routes
app.get('/favicon.ico', (req, res) => res.status(204)); // Respond with 204 No Content
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Define port
const port = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((error) => console.log(error.message));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});
