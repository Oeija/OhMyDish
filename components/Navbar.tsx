import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@mui/material";

const Navbar = () => {
  return (
    <header className="w-full absolute z-10">
        <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex justify-center items-center">
                    <Image 
                        src="/ohmydish!-logo.svg"
                        alt="Oh My Dish Logo"
                        width={50}
                        height={10}
                        className="object-contain"
                    />
                </Link>
                <Button component={Link} href="/" sx={{ color: "black" }}>Home</Button>
                <Button component={Link} href="/recipes"  sx={{ color: "black" }}>Recipes</Button>
                <Button component={Link} href="/favorites"  sx={{ color: "black" }}>Favorites</Button>
            </div>
        </nav>
    </header>
  )
}

export default Navbar