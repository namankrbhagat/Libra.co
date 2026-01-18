
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled, IconSearch, IconMapPin, IconShieldCheck } from "@tabler/icons-react";

export function FeaturesSectionWithBentoGrid() {
  const features = [
    {
      title: "Smart Book Search",
      description:
        "Find the exact edition you need by ISBN, title, or course code. Our smart filters save you hours of searching.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 md:col-span-4 lg:col-span-4 border-b md:border-r border-white/10",
    },
    {
      title: "Verified Student Sellers",
      description:
        "Connect with verified students from your campus. No bots, no scams, just real peers helping each other.",
      skeleton: <SkeletonTwo />,
      className: "col-span-1 md:col-span-2 lg:col-span-2 border-b border-white/10",
    },
    {
      title: "Safe Campus Meetups",
      description:
        "Our platform encourages safe, public meetups on college campuses for secure book exchanges.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-white/10",
    },
    {
      title: "Active on 500+ Campuses",
      description:
        "From IIT Bombay to Delhi University, Libra.co is connecting student communities across India.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-none border-white/10",
    },
  ];
  return (
    <div className="relative z-20 py-20 lg:py-40 max-w-7xl mx-auto bg-[#050505]">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white font-instrument-serif">
          Everything you need to <span className="italic text-orange-500">buy & sell</span>
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-400 text-center font-normal font-sans">
          Whether you're looking to clear your shelf or find affordable reads for your next semester, we've got you covered with powerful tools.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 mt-12 xl:border rounded-md border-white/10 bg-neutral-900/20 backdrop-blur-sm">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-instrument-serif">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-400 font-normal font-sans",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-neutral-900 shadow-2xl group h-full border border-white/5 rounded-xl overflow-hidden">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
          {/* Mock UI for Search */}
          <div className="flex items-center gap-2 bg-neutral-800 p-2 rounded-lg border border-white/10">
            <IconSearch className="text-neutral-400 h-4 w-4" />
            <div className="h-2 w-24 bg-neutral-700 rounded-full"></div>
          </div>
          <div className="space-y-2 p-2">
            <div className="h-20 w-full bg-neutral-800 rounded-lg animate-pulse delay-75"></div>
            <div className="h-20 w-full bg-neutral-800 rounded-lg animate-pulse delay-100"></div>
            <div className="h-20 w-full bg-neutral-800 rounded-lg animate-pulse delay-150"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-[#050505] via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

import { LocationMap } from "@/components/ui/expand-map";

export const SkeletonThree = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <LocationMap location="Campus Meetup Point" coordinates="IIT Bombay Main Gate" className="flex items-center justify-center" />
    </div>
  );
};

export const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-neutral-900 border border-neutral-700 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="student images"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0 grayscale hover:grayscale-0 transition-all"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-neutral-900 border border-neutral-700 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="student images"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0 grayscale hover:grayscale-0 transition-all"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-[#050505] to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-[#050505] to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], // Dark gray base
      markerColor: [249 / 255, 115 / 255, 22 / 255], // Orange markers (Tailwind Orange-500)
      glowColor: [0.2, 0.2, 0.2], // Subtle glow
      markers: [
        { location: [28.6139, 77.2090], size: 0.1 }, // Delhi
        { location: [19.0760, 72.8777], size: 0.1 }, // Mumbai
        { location: [12.9716, 77.5946], size: 0.1 }, // Bangalore
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
