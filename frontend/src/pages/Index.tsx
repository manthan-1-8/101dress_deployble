import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedSection from '@/components/FeaturedSection';
import ExclusiveFeatures from '@/components/ExclusiveFeatures';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <Hero />
      <FeaturedSection />
      <ExclusiveFeatures />
      <AboutSection />
      <Footer />
    </main>
  );
};

export default Index;
