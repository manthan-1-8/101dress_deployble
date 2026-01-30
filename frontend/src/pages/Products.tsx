import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
  const response = await fetch('http://localhost:8001/api/items');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

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
    // Search
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    // Category
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    // Type
    const matchesType = typeFilter === 'all' ||
      (typeFilter === 'sale' && (product.type === 'sale' || product.type === 'both')) ||
      (typeFilter === 'rent' && (product.type === 'rent' || product.type === 'both'));

    // Size
    const matchesSize = sizeFilter === 'all' || product.size === sizeFilter;

    // Price
    const hasSalePriceInRange = product.sale_price && product.sale_price >= priceRange[0] && product.sale_price <= priceRange[1];
    const hasRentPriceInRange = product.rent_price && product.rent_price >= priceRange[0] && product.rent_price <= priceRange[1];

    let matchesPrice = false;
    if (typeFilter === 'sale') matchesPrice = !!hasSalePriceInRange;
    else if (typeFilter === 'rent') matchesPrice = !!hasRentPriceInRange;
    else matchesPrice = !!(hasSalePriceInRange || hasRentPriceInRange);

    // If 'both' type is selected but we are filtering by price, we should ensure at least one applicable price falls in range.
    // If type is 'all', show if EITHER sale or rent price matches (or if item matches type logic).

    return matchesSearch && matchesCategory && matchesType && matchesSize && matchesPrice;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const sizes = ['all', ...Array.from(new Set(products.map(p => p.size))).sort()];

  const parallaxOffset = scrollY * 0.3;

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Editorial Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden"
      >
        {/* Parallax Background */}
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{
            transform: `translateY(-${parallaxOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img
            src="/assets/dresses.png"
            alt="Dresses Collection"
            className="w-full h-full object-cover object-center"
          />
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
          </div>
        </div>
      </section>

      {/* Advanced Filter Bar */}
      <section className="border-b border-border bg-background/95 backdrop-blur-md sticky top-20 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-6">

            {/* Top Row: Search & Filters Button (Mobile) */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-b border-border focus:border-gold outline-none text-foreground placeholder:text-muted-foreground font-light text-sm tracking-wide"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Type</span>
                  <ToggleGroup type="single" value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
                    <ToggleGroupItem value="all" aria-label="Toggle all">All</ToggleGroupItem>
                    <ToggleGroupItem value="sale" aria-label="Toggle sale">Buy</ToggleGroupItem>
                    <ToggleGroupItem value="rent" aria-label="Toggle rent">Rent</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Size Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Size</span>
                  <Select value={sizeFilter} onValueChange={setSizeFilter}>
                    <SelectTrigger className="w-[80px] h-8 text-xs">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>{size === 'all' ? 'All' : size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Price Filter */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Price</span>
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-[120px]"
                  />
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    ₹{(priceRange[0] / 1000).toFixed(0)}k-{(priceRange[1] / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Mobile Filter Sheet */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Listing Type</h4>
                        <ToggleGroup type="single" value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)} className="justify-start">
                          <ToggleGroupItem value="all" className="flex-1">All</ToggleGroupItem>
                          <ToggleGroupItem value="sale" className="flex-1">Buy</ToggleGroupItem>
                          <ToggleGroupItem value="rent" className="flex-1">Rent</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Size</h4>
                        <Select value={sizeFilter} onValueChange={setSizeFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map(size => (
                              <SelectItem key={size} value={size}>{size === 'all' ? 'Any Size' : size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Price Range (₹0 - ₹1L)</h4>
                        <Slider
                          defaultValue={[0, 100000]}
                          max={100000}
                          step={1000}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Category Pills */}
            <nav className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`text-xs uppercase tracking-[0.15em] whitespace-nowrap px-3 py-1.5 rounded-full transition-all duration-300 ${categoryFilter === category
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
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
                  className={`group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <article className="space-y-6">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
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
