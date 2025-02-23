"use client";

import React, { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";
import { SuggestionType } from "@/models/suggestionType";
import Image from 'next/image';


const Suggestion = () => {
    const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
    const [recipeName, setRecipeName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        const storedSuggestions = localStorage.getItem("suggestions");
        if (storedSuggestions) {
            setSuggestions(JSON.parse(storedSuggestions));
        }
    }, []);

    const saveToLocalStorage = (updatedSuggestions: SuggestionType[]) => {
        setSuggestions(updatedSuggestions);
        localStorage.setItem("suggestions", JSON.stringify(updatedSuggestions));
    };

    const handleSubmit = () => {
        if (!recipeName || !description) return;
        
        if (editingId !== null) {
            const updatedSuggestions = suggestions.map(suggestion => 
                suggestion.id === editingId 
                    ? { ...suggestion, name: recipeName, description } 
                    : suggestion
            );
            saveToLocalStorage(updatedSuggestions);
            setEditingId(null);
        } else {
            const newSuggestion: SuggestionType = {
                id: Date.now(),
                name: recipeName,
                description,
            };
            saveToLocalStorage([...suggestions, newSuggestion]);
        }
        
        setRecipeName("");
        setDescription("");
    };

    const handleEdit = (id: number) => {
        const suggestionToEdit = suggestions.find(suggestion => suggestion.id === id);
        if (suggestionToEdit) {
            setRecipeName(suggestionToEdit.name);
            setDescription(suggestionToEdit.description);
            setEditingId(id);
        }
    };

    const handleDelete = (id: number) => {
        const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== id);
        saveToLocalStorage(updatedSuggestions);
    };

    const shareOnTwitter = (name: string, description: string) => {
        const tweetText = `Check out my recipe suggestion!\n\nRecipe name: ${name}\nRecipe description: ${description}\n\n#OhMyDish #RecipeSuggestion`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, "_blank");
    };

    return (
        <div className="flex flex-col items-center mx-auto">
            <div className="w-full h-8 bg-[#493628] mb-2"></div>
            <div className="w-full h-8 bg-[#493628] mb-10"></div>
            <div className="suggestion__image-container">
                <div className="suggestion__image">
                    <Image src="/ingredients3.png" alt="steak" width={300} height={500} className="object-contain ms-6" />
                </div>
            </div>

            <div className="flex flex-col w-[75%] items-center gap-6 mb-10">
                <h2 className="suggestion__title">Got a Delicious Recipe in Mind?</h2>
                <p className="suggestion__subtitle">Share your recipe idea with us on X for a chance to be featured here!</p>
                <TextField 
                    label="Recipe Name" 
                    variant="outlined" 
                    fullWidth 
                    value={recipeName} 
                    onChange={(e) => setRecipeName(e.target.value)}
                />
                <TextField 
                    label="Description" 
                    variant="outlined" 
                    fullWidth 
                    multiline 
                    rows={3} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button 
                    variant="contained"
                    sx={{color: "white", backgroundColor: "#493628", borderRadius: 10}} 
                    onClick={handleSubmit} 
                    className="w-full"
                >
                    {editingId !== null ? "Update Suggestion" : "Save Suggestion"}
                </Button>

                <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="shadow-lg">
                            <CardContent>
                                <Typography variant="h6">{suggestion.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{suggestion.description}</Typography>
                                <div className="flex justify-between mt-4">
                                    <Button size="small" sx={{color: "#AB886D"}} onClick={() => handleEdit(suggestion.id)}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(suggestion.id)}>Delete</Button>
                                    <Button size="small" color="primary" onClick={() => shareOnTwitter(suggestion.name, suggestion.description)}>Share</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            
            
        </div>
    );
};

export default Suggestion;