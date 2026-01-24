
import React from 'react';
import ResponsiveHeroBanner from './ui/hero-banner';

const HeroDemo = ({ user }) => {
  return (
    <ResponsiveHeroBanner
      user={user}

      navLinks={[
        { label: "Home", href: "/", isActive: true },
        { label: "Buy Books", href: "#buy" },
        { label: "Sell Books", href: "#sell" },
        { label: "Requests", href: "#requests" },
        { label: "About", href: "#about" }
      ]}
      badgeLabel="New"
      badgeText="Start Selling for Free"
      title="Smarter Way to Buy"
      titleLine2="Original Textbooks"
      description="Libra.co connects you with students on your campus to buy and sell second-hand books instantly. Save money, save paper, and build your library."
      ctaButtonText="Join Now"
      ctaButtonHref="/signup"
      primaryButtonText="Find Books Nearby"
      primaryButtonHref="/buy"
      secondaryButtonText="List a Book"
      secondaryButtonHref="/sell"
      partnersTitle="Trusted by students from top boards & institutes"
      partners={[
        { name: "IIT Bombay", logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Indian_Institute_of_Technology_Bombay_Logo.svg/800px-Indian_Institute_of_Technology_Bombay_Logo.svg.png", href: "#" },
        { name: "AIIMS", logoUrl: "/partners/aiims.png", href: "#" },
        { name: "CBSE", logoUrl: "/partners/cbse.png", href: "#" },
        { name: "UPSC", logoUrl: "/partners/upsc.jpg", href: "#" },
        { name: "MSBTE", logoUrl: "/partners/msbte.jpg", href: "#" },
        { name: "UP Board", logoUrl: "/partners/upboard.png", href: "#" }
      ]}
    />
  );
};

export default HeroDemo;
