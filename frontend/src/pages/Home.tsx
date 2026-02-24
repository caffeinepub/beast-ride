import React from 'react';
import HeroSection from '../components/HeroSection';
import CategorySplit from '../components/CategorySplit';
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel';
import PerformanceHighlight from '../components/PerformanceHighlight';
import CinematicParallax from '../components/CinematicParallax';
import Reviews from '../components/Reviews';
import InstagramCommunity from '../components/InstagramCommunity';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySplit />
      <FeaturedProductsCarousel />
      <PerformanceHighlight />
      <CinematicParallax />
      <Reviews />
      <InstagramCommunity />
    </>
  );
}
