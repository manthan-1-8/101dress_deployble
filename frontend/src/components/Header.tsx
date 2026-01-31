import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, MessageCircle } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBg = isHomePage
    ? (isScrolled ? 'header-glass' : 'bg-transparent')
    : 'header-glass';

  const textColor = isHomePage && !isScrolled ? 'text-ivory' : 'text-foreground';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${headerBg
        } ${isHomePage ? 'py-6' : 'py-4'}`}
    >
      <nav className="container mx-auto px-6 md:px-12 relative flex items-center min-h-[48px]">
        {/* Left Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/products"
            className={`nav-link text-nav transition-colors duration-500 ${textColor}`}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`nav-link text-nav transition-colors duration-500 ${textColor}`}
          >
            About
          </Link>
          <Link
            to="/sell"
            className={`nav-link text-nav transition-colors duration-500 ${textColor}`}
          >
            Sell
          </Link>
          <Link
            to="/my-listings"
            className={`nav-link text-nav transition-colors duration-500 ${textColor}`}
          >
            My Listings
          </Link>
        </div>

        {/* Center Logo */}
        <Link
          to="/"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-xl md:text-2xl tracking-wide transition-colors duration-500 ${textColor}`}
        >
          101 Dresses
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6 md:gap-8 ml-auto">
          <button
            className={`icon-hover transition-colors duration-500 ${textColor}`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <Link
            to="/chat"
            className={`icon-hover transition-colors duration-500 ${textColor}`}
            aria-label="Chat"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <button
            className={`icon-hover transition-colors duration-500 ${textColor}`}
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <Link
            to="/profile"
            className={`icon-hover transition-colors duration-500 ${textColor}`}
            aria-label="Profile"
          >
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
