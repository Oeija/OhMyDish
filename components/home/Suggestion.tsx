"use client";

import { useEffect, useState } from "react";
import { SuggestionType } from "@/models/suggestionType";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";

export default function Suggestion() {
    const supabase = createClient();
    const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null); 
    const [user, setUser] = useState<User | null>(null);

    async function fetchSuggestions() {
        let { data, error } = await supabase.from("suggestions").select("*");
        if (error) {
            console.error("Error fetching suggestions:", error);
            return;
        }
        setSuggestions(data ?? []);
    }

    useEffect(() => {
        async function checkSession() {
            console.log("Fetching session...");
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                console.error("No active session detected", error);
                setUser(null);
            } else {
                console.log("User session detected:", data.session.user);
                setUser(data.session.user);
            }
        }

        checkSession();
        fetchSuggestions();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Auth event: ${event}`, session);
            if (session) {
                console.log("Session updated:", session);
                setUser(session.user);
            } else {
                console.log("Session is null, user logged out.");
                setUser(null);
            }
        });

        return () => {
            authListener.subscription?.unsubscribe();
        };
    }, []);

    async function addSuggestion() {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session?.user) {
            console.error("User not authenticated");
            return;
        }

        const userId = sessionData.session.user.id;

        if (editingId) {
            
            const { error } = await supabase
                .from("suggestions")
                .update({ content })
                .eq("id", editingId);

            if (error) {
                console.error("Error updating suggestion:", error);
                return;
            }

            setSuggestions((prev) =>
                prev.map((s) => (s.id === editingId ? { ...s, content } : s))
            );
            setEditingId(null);
        } else {
            
            const { data, error } = await supabase
                .from("suggestions")
                .insert([{ user_id: userId, content }])
                .select()
                .single();

            if (error) {
                console.error("Error inserting suggestion:", error);
                return;
            }

            setSuggestions([...suggestions, data]);
        }

        setContent("");
    }

    async function deleteSuggestion(id: string) {
        const { error } = await supabase.from("suggestions").delete().eq("id", id);
        if (error) {
            console.error("Error deleting suggestion:", error);
            return;
        }
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }

    async function editSuggestion(id: string) {
       
        const suggestionToEdit = suggestions.find((s) => s.id === id);
        if (!suggestionToEdit) return;

        setContent(suggestionToEdit.content); 
        setEditingId(id); 
    }

    const shareOnTwitter = (content: string) => {
        const tweetText = `Check out my recipe suggestion!\n\nRecipe description: ${content}\n\n#OhMyDish #RecipeSuggestion`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, "_blank");
    };

    return (
      <div className="flex flex-col items-center">
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
            label="Write Your Recipe Suggestion..." 
            variant="outlined" 
            fullWidth 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
          />
          <Button 
            variant="contained"
            sx={{color: "white", backgroundColor: "#493628", borderRadius: 10}} 
            onClick={addSuggestion} 
            className="w-full"
          >
            {editingId ? "Update Suggestion" : "Submit Suggestion"}
          </Button>

          <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s) => (
              <Card key={s.id} className="shadow-lg">
                <CardContent>
                  <Typography variant="body2" color="textSecondary">{s.content}</Typography>
                  <div className="flex justify-between mt-4">
                    <Button size="small" sx={{color: "#AB886D"}} onClick={() => editSuggestion(s.id)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => deleteSuggestion(s.id)}>Delete</Button>
                    <Button size="small" color="primary" onClick={() => shareOnTwitter(s.content)}>Share</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
}
