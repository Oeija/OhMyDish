"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

const Hero = () => {
  const router = useRouter();

  const handleNavigateToRecipes = () => {
    router.push('/recipes');
  }

  return (
    <div className="hero">
      <div className="flex-1 pt-36 pb-10 padding-x">
        <h1 className="hero__title">
          Craving something new? Find it here!
        </h1>
        <p className="hero__subtitle">
          Over hundreds of creative recipes from all cuisines around the world.
        </p>
        <Button 
          variant="contained"
          sx={{color: "white", backgroundColor: "#493628", borderRadius: 10, mt:4, px:3, py: 2}} 
          onClick={handleNavigateToRecipes} 
          className=""
        >
          Explore Recipes
        </Button>
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>
        <div className="hero__image-overlay" />
      </div>
    </div>
  )
}

export default Hero