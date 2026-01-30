import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  category: string;
  brand: string;
  size: string;
  condition: string;
  type: string;
  sale_price?: number;
  rent_price?: number;
  deposit?: number;
  image: string;
  status: string;
  verified: boolean;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:8000/api/items');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    setIsVisible(true);
    
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const parallaxOffset = scrollY * 0.3;

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Editorial Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden"
      >
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 w-full h-[120%]"
          style={{ 
            transform: `translateY(-${parallaxOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-secondary via-cream to-accent" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-background/80" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl">
            <div className="w-16 h-px bg-gold mb-8 animate-fade-in-up" />
            
            <p className="text-editorial-accent text-foreground/70 mb-6 animate-fade-in-up uppercase tracking-[0.3em]">
              The Collection
            </p>

            <div className="animate-fade-in-up-delayed">
              <h1 className="font-serif text-editorial-display text-foreground leading-none font-light mb-6">
                Dresses
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-foreground/80 font-light max-w-2xl animate-fade-in-up-delayed-2 leading-relaxed">
              Curated couture. Rent, sell, and discover pre-loved luxury with confidence.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up-delayed-3">
          <div className="flex flex-col items-center gap-3">
            <span className="text-foreground/50 text-xs uppercase tracking-[0.3em] font-sans">
              Browse
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Editorial Filter Bar */}
      <section className="border-b border-border bg-background/95 backdrop-blur-md sticky top-20 z-40">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-auto md:flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by brand or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-border focus:border-gold outline-none transition-colors duration-500 text-foreground placeholder:text-muted-foreground font-light"
              />
            </div>

            {/* Category Filters */}
            <nav className="flex gap-6 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`text-sm uppercase tracking-[0.2em] transition-colors duration-500 font-sans ${
                    categoryFilter === category 
                      ? 'text-foreground border-b-2 border-gold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Editorial Products Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-6" />
                  <div className="h-4 bg-muted w-3/4 mb-3" />
                  <div className="h-3 bg-muted w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-20">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className={`group transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <article className="space-y-6">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      
                      {/* Subtle Overlay on Hover */}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-all duration-700" />

                      {/* Verification Badge */}
                      {product.verified && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <ShieldCheck className="w-4 h-4 text-gold" />
                          <span className="text-xs uppercase tracking-wider text-foreground/90 font-sans">
                            Verified
                          </span>
                        </div>
                      )}

                      {/* Availability Badge */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="text-xs uppercase tracking-wider text-foreground/70 font-sans">
                          {product.type === 'both' ? 'Sale • Rent' : 
                           product.type === 'sale' ? 'For Sale' : 'For Rent'}
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-serif text-2xl font-light text-foreground mb-1 group-hover:text-gold transition-colors duration-500">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-light uppercase tracking-wider">
                          {product.brand}
                        </p>
                      </div>

                      {/* Pricing - Editorial Style */}
                      <div className="flex items-baseline gap-4 text-sm">
                        <span className="text-muted-foreground uppercase tracking-wide font-sans">
                          Size {product.size}
                        </span>
                        <span className="w-px h-4 bg-border" />
                        <span className="text-muted-foreground uppercase tracking-wide font-sans">
                          {product.condition}
                        </span>
                      </div>

                      {/* Price Display */}
                      <div className="pt-2 space-y-1">
                        {(product.type === 'both' || product.type === 'sale') && product.sale_price && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
                              Purchase
                            </span>
                            <span className="font-serif text-xl text-gold">
                              ₹{product.sale_price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {(product.type === 'both' || product.type === 'rent') && product.rent_price && (
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-sans">
                              Rent / Day
                            </span>
                            <span className="font-serif text-xl text-gold">
                              ₹{product.rent_price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-32">
              <div className="w-16 h-px bg-gold mx-auto mb-8" />
              <p className="font-serif text-2xl text-muted-foreground font-light">
                No pieces found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Products;
