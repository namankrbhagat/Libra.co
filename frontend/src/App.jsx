import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import HeroDemo from '@/components/HeroDemo'
import { AnimatedTestimonialsDemo } from "@/components/AnimatedTestimonialsDemo";
import { Footer } from "@/components/ui/footer-section";
import { FeaturesSectionWithBentoGrid } from "@/components/ui/feature-section-with-bento-grid";

const App = () => {
  return (
    <main>
      <Toaster />
      <HeroDemo />
      <FeaturesSectionWithBentoGrid />
      <AnimatedTestimonialsDemo />
      <Footer />
    </main>
  )
}

export default App