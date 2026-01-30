import { useEffect, useRef, useState } from 'react';

const FeaturedSection = () => {
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
      id="collection"
      className="min-h-screen bg-background py-24 md:py-32"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <p className="text-editorial-accent text-muted-foreground mb-4">
            The Edit
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground font-light">
            Curated Pieces
          </h2>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Large Feature Card - Evening Gowns */}
          <div
            className={`group relative aspect-[3/4] overflow-hidden bg-cream transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <img
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"
              alt="Evening Gowns"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
            <div className="absolute inset-0 flex items-end p-8 z-20">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/90 mb-2 font-sans">
                  Featured
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-white">
                  Evening Gowns
                </h3>
              </div>
            </div>
          </div>

          {/* Stacked Cards */}
          <div className="flex flex-col gap-8 md:gap-12">
            {/* Designer Coats */}
            <div
              className={`group relative aspect-[4/3] overflow-hidden bg-secondary transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000"
                alt="Designer Coats"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              <div className="absolute inset-0 flex items-end p-8 z-20">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/90 mb-2 font-sans">
                    New Arrivals
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white">
                    Designer Coats
                  </h3>
                </div>
              </div>
            </div>

            {/* Vintage Finds */}
            <div
              className={`group relative aspect-[4/3] overflow-hidden bg-accent transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000"
                alt="Vintage Finds"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              <div className="absolute inset-0 flex items-end p-8 z-20">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/90 mb-2 font-sans">
                    Timeless
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white">
                    Vintage Finds
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <a
            href="#products"
            className="px-8 py-4 bg-ivory text-foreground font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:bg-gold hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 rounded-xl inline-block font-medium"
          >
            View All Pieces
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
