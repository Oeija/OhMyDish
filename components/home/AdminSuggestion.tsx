"use client";

import { useEffect, useState } from "react";
import { SuggestionType } from "@/models/suggestionType";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function AdminSuggestions() {

    const supabase = createClient();
    const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    async function fetchSuggestions() {
        let { data: suggestions, error: suggestionsError } = await supabase
            .from("suggestions")
            .select("id, content, created_at, user_id")
            .order("created_at", { ascending: false });
    
        if (suggestionsError) {
            console.error("Error fetching suggestions:", suggestionsError);
            return;
        }
    
        if (!suggestions) {
            console.warn("No suggestions found.");
            return;
        }
    
        const userIds = suggestions.map(s => s.user_id);
    
        let { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, email")
            .in("id", userIds);
    
        if (usersError) {
            console.error("Error fetching users:", usersError);
            return;
        }
    
        console.log("🔍 Users Data:", users);
    
        const formattedData = suggestions.map(s => {
            const user = users?.find(u => u.id === s.user_id);
            return {
                ...s,
                user: {
                    email: user ? user.email : "Unknown User"
                }
            };
        });
    
        console.log("✅ Formatted Suggestions:", JSON.stringify(formattedData, null, 2));
    
        setSuggestions(formattedData);
    }
    
    async function deleteSuggestion(id: string) {
    
        const { data, error } = await supabase.from("suggestions").delete().eq("id", id);
    
        if (error) {
            console.error("Error deleting suggestion:", error);
            return;
        }
    
        if (!data) {
            console.warn("Warning: No data returned from Supabase. Check RLS policies.");
        }
    
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-8 bg-[#493628] mb-2"></div>
            <div className="w-full h-8 bg-[#493628] mb-10"></div>

            <div className="flex flex-col w-[75%] items-center gap-6 mb-10">
                <h2 className="suggestion__title">All Suggestions</h2>
                <p className="suggestion__subtitle">See all the suggestions here. Delete if it's inappropriate.</p>

                <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((s) => (
                        <Card key={s.id} className="shadow-lg">
                            <CardContent>
                                <Typography variant="subtitle2" color="textSecondary">{s.user.email}</Typography>
                                <Typography variant="body2" color="textSecondary">{s.content}</Typography>
                                <div className="flex justify-between mt-4">
                                    <Button size="small" color="error" onClick={() => deleteSuggestion(s.id)}>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
