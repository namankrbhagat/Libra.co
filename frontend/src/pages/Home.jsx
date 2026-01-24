import React from 'react';
import Hero from '@/components/Hero';
import { FeaturesSectionWithBentoGrid } from "@/components/featureSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/footerSection";

const Home = ({ user }) => {
  return (
    <>
      <Hero user={user} />
      {/* Add margins or keep existing layout logic */}
      <FeaturesSectionWithBentoGrid />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
