import { Footer, Navbar } from "@/components";
import { createClient } from "@/lib/supabase/server";
import "@/app/globals.css";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, redirecting to login...");
    redirect("/login"); 
  }

  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
