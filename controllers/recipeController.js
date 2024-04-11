import Recipe from '../models/recipeModel.js';
import mongoose from 'mongoose';

const { isValidObjectId } = mongoose;

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getRecipeByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const recipe = await Recipe.findOne({ title });
        if (!recipe) return res.status(404).json({ message: "not found" });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe({
            title: req.body.title,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            cookingTime: req.body.cookingTime,
        });

        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const updatedRecipe = req.body;
    try {
        const recipe = await Recipe.findByIdAndUpdate(id, updatedRecipe, { new: true });
        if (!recipe) return res.status(404).json({ message: " not found" });
        res.json(recipe);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteRecipe = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalidformat for id" });
    }

    try {
        const result = await Recipe.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "not found" });
        }
        res.json({ message: "deleted successfully" });
    } catch (error) {
        console.error("Error deleting recipe:", error); // Detailed logging
        res.status(500).json({ message: "server error" });
    }
};

export {
    getAllRecipes,
    getRecipeByTitle,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
