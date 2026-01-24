
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Libra.co helped me find the exact engineering textbooks I needed for my semester at half the price. The connection with local sellers was seamless.",
      name: "Sarah Chen",
      designation: "Computer Science Student at IIT Bombay",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Selling my old medical books was so easy. I cleared up shelf space and made some pocket money for my next year's supplies.",
      name: "Michael Rodriguez",
      designation: "Medical Student at AIIMS Delhi",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "I love the sustainable aspect of re-using books. The platform is beautifully designed and very intuitive to use.",
      name: "Emily Watson",
      designation: "Literature Major at Delhi University",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Found rare reference books for my UPSC preparation that were out of stock everywhere else. A lifesaver!",
      name: "James Kim",
      designation: "UPSC Aspirant",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The community feel is great. It's not just buying books, it's connecting with other students who have walked the same path.",
      name: "Lisa Thompson",
      designation: "Law Student",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-[#050505]">
      {/* Ambient Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mb-12">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-instrument-serif text-white mb-6">
            Loved by <span className="italic text-orange-500">Scholars & Students</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-white/60 max-w-2xl mx-auto font-sans">
            Join thousands of students who are saving money and building their libraries with Libra.co.
          </p>
        </ScrollReveal>
      </div>

      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
