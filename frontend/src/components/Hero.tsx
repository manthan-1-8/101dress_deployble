import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-fashion.jpg';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-[130%] animate-parallax"
        style={{
          transform: `translateY(-${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <img
          src={heroImage}
          alt="Luxury fashion editorial - curated couture"
          className="w-full h-full object-cover object-center animate-scale-subtle"
        />
      </div>

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          {/* Accent Line */}
          <div className="w-16 h-px bg-gold mb-8 animate-fade-in-up" />

          {/* Top Accent Text */}
          <p className="text-editorial-accent text-ivory/90 mb-6 animate-fade-in-up">
            The Future of Luxury Fashion
          </p>

          {/* Brand Name */}
          <div className="animate-fade-in-up-delayed">
            <h1 className="text-editorial-hero text-ivory leading-none">
              <span className="block font-light">101</span>
              <span className="block font-light italic -mt-2 md:-mt-6">Dresses</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-ivory/80 font-light mt-8 max-w-lg animate-fade-in-up-delayed-2">
            Curated couture. Rent, sell, and discover pre-loved luxury with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-in-up-delayed-3">
            <Link
              to="/products"
              className="px-8 py-4 bg-ivory text-foreground font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:bg-gold hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 rounded-xl text-center font-medium"
            >
              Explore Collection
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-black/30 backdrop-blur-md border border-ivory/40 text-ivory font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:bg-ivory hover:text-foreground rounded-xl hover:shadow-lg text-center font-medium"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up-delayed-3">
        <div className="flex flex-col items-center gap-3">
          <span className="text-ivory/50 text-xs uppercase tracking-[0.3em] font-sans">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-ivory/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
