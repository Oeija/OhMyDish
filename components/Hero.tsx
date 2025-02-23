"use client"

import Image from 'next/image';
import CustomButton from './CustomButton';
import { useRouter } from 'next/navigation';

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
        <CustomButton 
          title="EXPLORE RECIPES"
          containerStyles="bg-[#493628] text-white rounded-full mt-6"
          handleClick={handleNavigateToRecipes}
        />
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