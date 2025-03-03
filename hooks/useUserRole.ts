"use client"

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const supabase = createClient();

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        setRole(null);
        return;
      }

      const { data, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (roleError || !data) {
        setRole(null);
        return;
      }

      setRole(data.role);
    };

    fetchRole();
  }, []);

  return role;
}
