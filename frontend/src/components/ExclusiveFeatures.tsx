import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Camera,
  Lock,
  Award
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Rent & Sell',
    description: 'List your designer pieces or rent exclusive couture for special occasions.',
    accent: 'Marketplace'
  },
  {
    icon: MessageCircle,
    title: 'AI Concierge',
    description: 'Intelligent chatbot support for buyers and sellers, available 24/7.',
    accent: 'Smart Support'
  },
  {
    icon: ShieldCheck,
    title: 'Fraud Detection',
    description: 'AI-powered image quality analysis ensures authenticity of every piece.',
    accent: 'Verified'
  },
  {
    icon: Camera,
    title: 'Virtual Try-On',
    description: 'Experience luxury before you commit with our AR-powered fitting room.',
    accent: 'Premium'
  },
  {
    icon: Lock,
    title: 'Secure Escrow',
    description: 'Trusted pipeline with secured transactions protecting both parties.',
    accent: 'Protected'
  },
  {
    icon: Award,
    title: 'Loyalty Credits',
    description: 'Earn rewards based on your transaction history for exclusive discounts.',
    accent: 'Rewards'
  }
];

const ExclusiveFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 md:py-32 bg-secondary/30"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-px bg-gold" />
          </div>
          <p className="text-editorial-accent text-muted-foreground mb-4">
            Why Choose Us
          </p>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground font-light">
            Exclusive Features
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto font-light">
            Experience the future of luxury fashion with our innovative platform designed for discerning collectors and style connoisseurs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-8 bg-background border border-border/50 transition-all duration-700 hover:border-gold/30 hover:shadow-lg ${isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Accent Tag */}
              <span className="absolute top-4 right-4 text-xs uppercase tracking-[0.2em] text-gold font-sans">
                {feature.accent}
              </span>

              {/* Icon */}
              <div className="mb-6 relative">
                <div className="w-14 h-14 flex items-center justify-center border border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold/5">
                  <feature.icon className="w-6 h-6 text-gold transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-gold transition-colors duration-500">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <a
            href="#collection"
            className="px-8 py-4 bg-ivory text-foreground font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:bg-gold hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 rounded-xl inline-block font-medium"
          >
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveFeatures;