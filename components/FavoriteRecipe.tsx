"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Modal, Box, styled } from "@mui/material";
import { Recipe } from "@/models/recipe";
import axios from "axios";

const ViewButton = styled(Button)`
    border: 1px solid black;
    color: white;
    background-color: #493628;
    font-weight: light;
    &:hover {
        background-color: black;
        opacity: 0.9;
    }
`;

const RemoveButton = styled(Button)`
    border: 1px solid red;
    color: white;
    background-color: red;
`;

const FavoriteRecipe = () => {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const removeFromFavorites = (idMeal: string) => {
        const updatedFavorites = favorites.filter((recipe) => recipe.idMeal !== idMeal);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const fetchRecipeDetails = async (idMeal: string) => {
        try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        return res.data.meals ? res.data.meals[0] : null;
        } catch (error) {
        console.error("Error fetching recipe details", error);
        return null;
        }
    };

    const handleViewRecipe = async (recipe: Recipe) => {
        if (recipe.strInstructions) {
        setSelectedRecipe(recipe);
        } else {
        const fullRecipe = await fetchRecipeDetails(recipe.idMeal);
        if (fullRecipe) {
            setSelectedRecipe(fullRecipe);
        }
        }
    };

    return (
        <div className="favoriteRecipe flex flex-col items-center justify-center">

            <div className="flex flex-col gap-4 mb-12 pt-36">
                <div className="flex flex-col items-center text-center">
                    <h1 className="favoriteRecipe__title">Your Favorite Recipe</h1>
                    <p className="favoriteRecipe__subtitle">
                        Store your favorite recipe easily, for free.
                    </p>
                </div>
            </div>

            <div className="w-[90%] mx-auto">
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center w-full mb-10">
                        <img src="/empty-favorites.png" alt="No Favorites" className="w-[250px] h-auto mb-4" />
                        <p className="text-gray-500 text-lg">You haven't added any favorite recipes yet!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-10">
                        {favorites.map((recipe) => (
                            <Card key={recipe.idMeal} className="max-w-[300px] mx-auto">
                                <CardMedia component="img" height="200" image={recipe.strMealThumb} alt={recipe.strMeal} />
                                <CardContent>
                                    <Typography variant="h6">{recipe.strMeal}</Typography>
                                    <Typography variant="body2" color="textSecondary">{recipe.strArea}</Typography>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <ViewButton onClick={() => handleViewRecipe(recipe)}>View Recipe</ViewButton>
                                        <RemoveButton color="error" onClick={() => removeFromFavorites(recipe.idMeal)}>
                                            Remove from Favorites
                                        </RemoveButton>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            

            <Modal open={Boolean(selectedRecipe)} onClose={() => setSelectedRecipe(null)}>
                <Box className="bg-white p-6 max-w-[800px] w-full mx-auto mt-20 rounded-lg shadow-lg">
                    {selectedRecipe && (
                        <>
                            <Typography variant="h5" className="text-center font-bold mb-2">
                                {selectedRecipe.strMeal}
                            </Typography>
                            <Typography variant="h6" className="text-center text-gray-500 mb-4">
                                How to Cook 101
                            </Typography>
                            <Typography 
                                variant="body1" 
                                className="text-gray-700 max-h-[200px] overflow-y-auto"
                            >
                                {selectedRecipe.strInstructions}
                            </Typography>
                            <Button 
                                variant="contained" 
                                sx={{color: "white", backgroundColor: "#493628"}} 
                                onClick={() => setSelectedRecipe(null)} 
                                className="mt-4 w-full"
                            >
                                Close
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default FavoriteRecipe;