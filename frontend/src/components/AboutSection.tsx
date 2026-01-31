import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-32 bg-cream"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <p className="text-editorial-accent text-muted-foreground mb-6">
              Our Philosophy
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground font-light leading-tight mb-8">
              Where luxury finds
              <span className="italic"> new purpose</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                At 101 Dresses, we believe that true elegance transcends seasons.
                Each piece in our collection has been carefully curated,
                authenticated, and prepared for its next chapter.
              </p>
              <p>
                We partner with discerning collectors and fashion houses to bring
                you extraordinary pieces that tell a story—garments that have
                graced runways, red carpets, and the most elegant occasions.
              </p>
            </div>
            <div className="mt-10">
              <a
                href="#story"
                className="nav-link text-foreground text-nav inline-flex items-center gap-2 group"
              >
                Read Our Story
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Visual Element */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <div className="relative">
              {/* Decorative frame */}
              <div className="aspect-[3/4] bg-secondary overflow-hidden">
                <img
                  src="/assets/ce2b5dd884344227fac28db59bbc6956.jpg"
                  alt="Luxury Fashion"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-accent" />
              <div className="absolute -top-6 -left-6 w-20 h-20 border border-gold/30" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-border transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {[
            { number: '10K+', label: 'Curated Pieces' },
            { number: '200+', label: 'Designer Partners' },
            { number: '50+', label: 'Countries Served' },
            { number: '100%', label: 'Authenticated' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                {stat.number}
              </p>
              <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground font-sans">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
