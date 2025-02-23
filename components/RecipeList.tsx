"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, Card, CardContent, CardMedia, Typography, Button, Modal, Box, Autocomplete, styled } from "@mui/material";
import { Recipe } from "@/models/recipe";

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

const AddButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "isFavorited",
  })<{ isFavorited: boolean }>`
    border: 1px solid black;
    color: ${({ isFavorited }) => (isFavorited ? "white" : "#493628")};
    background-color: ${({ isFavorited }) => (isFavorited ? "red" : "transparent")};
    font-weight: light;
    &:hover {
      background-color: black;
      color: white;
      opacity: 0.9;
    }
`;

const RecipeList = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 6;

    useEffect(() => {
        fetchAllCountries();
        fetchRandomRecipes();
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const fetchRandomRecipes = async () => {
        try {
            const res = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
            setRecipes([res.data.meals[0]]);
        } catch (error) {
            console.error("Error fetching random recipes", error);
        }
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

    const searchRecipes = async () => {
        if (!searchTerm) return;
        try {
            const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            setRecipes(res.data.meals || []);
        } catch (error) {
            console.error("Error searching recipes", error);
        }
    };

    const filterByCountry = async (country: string) => {
        try {
            const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`);
            setRecipes(res.data.meals || []);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error filtering recipes", error);
        }
    };

    const fetchAllCountries = async () => {
        try {
            const res = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
            const countryList = res.data.meals.map((meal: { strArea: string }) => meal.strArea);
            setCountries(countryList);
        } catch (error) {
            console.error("Error fetching countries", error);
        }
    };

    const toggleFavorite = (recipe: Recipe) => {
        const isFavorited = favorites.some((fav) => fav.idMeal === recipe.idMeal);
        const updatedFavorites = isFavorited
          ? favorites.filter((fav) => fav.idMeal !== recipe.idMeal)
          : [...favorites, recipe];
    
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    // Pagination Logic
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="recipeList flex flex-col items-center justify-center">
            <div className="flex flex-col gap-4 mb-12 pt-36 w-[75%]">
            
                <div className="header flex flex-col items-center text-center mb-5">
                    <h1 className="recipeList__title">Find the Best Recipe Here</h1>
                    <p className="recipeList__subtitle">
                        Unlock vast knowledge of recipes you never knew before.
                    </p>
                </div>

                <div className="bars flex gap-4 items-center">
                    <TextField
                    label="Search Recipe"
                    variant="outlined"
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && searchRecipes()}
                    />
                    <Select
                    value={country}
                    onChange={(e) => filterByCountry(e.target.value)}
                    displayEmpty
                    className="flex-1"
                    >
                        <MenuItem value="">All Countries</MenuItem>
                        {countries.map((c) => (
                            <MenuItem key={c} value={c}>
                            {c}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] mx-auto">
                {currentRecipes.map((recipe) => (
                    <Card key={recipe.idMeal} className="max-w-[300px] mx-auto">
                        <CardMedia component="img" height="200" image={recipe.strMealThumb} alt={recipe.strMeal} />
                        <CardContent>
                            <Typography variant="h6">{recipe.strMeal}</Typography>
                            <Typography variant="body2" color="textSecondary">{recipe.strArea}</Typography>
                            <div className="flex flex-col gap-2 mt-3">
                                <ViewButton onClick={() => handleViewRecipe(recipe)}>
                                    View Recipe
                                </ViewButton>
                                <AddButton
                                isFavorited={favorites.some((fav) => fav.idMeal === recipe.idMeal)}
                                onClick={() => toggleFavorite(recipe)}
                                >
                                    {favorites.some((fav) => fav.idMeal === recipe.idMeal) ? "Remove from Favorites" : "Add to Favorites"}
                                </AddButton>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(recipes.length / recipesPerPage) }, (_, index) => (
                    <button 
                        key={index} 
                        onClick={() => paginate(index + 1)} 
                        className={`px-6 py-1 mx-1 mt-6 border ${currentPage === index + 1 ? "bg-[#AB886D] text-white" : "bg-white text-gray-800"}`}
                    >
                        {index + 1}
                    </button>
                ))}
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

export default RecipeList;