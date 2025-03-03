"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Hero, Suggestion, AdminSuggestion } from "@/components";

export default function Home() {

  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log("Session Data:", authData);
      if (authError || !authData?.user) {
        console.error("No active session detected.");
        setRole(null);
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // Fetch user role from the 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else {
        console.log("User role fetched:", data.role);
        setRole(data.role);
      }
      setLoading(false);
    }

    fetchUserRole();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="overflow-hidden">
      <Hero />
      {role === "admin" ? <AdminSuggestion /> : <Suggestion />}
    </main>
  );
}
