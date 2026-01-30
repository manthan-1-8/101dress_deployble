const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl mb-6">101 Dresses</h3>
            <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
              Pre-loved luxury, reimagined for the discerning. 
              Curating the world's finest designer pieces since 2020.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] mb-6 text-primary-foreground/50">
              Navigate
            </p>
            <ul className="space-y-4">
              {['Products', 'About', 'The Edit', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="nav-link text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-500"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] mb-6 text-primary-foreground/50">
              Connect
            </p>
            <ul className="space-y-4">
              {['Instagram', 'Pinterest', 'Newsletter'].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="nav-link text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-500"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 101 Dresses. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-primary-foreground transition-colors duration-500">
              Privacy
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors duration-500">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
