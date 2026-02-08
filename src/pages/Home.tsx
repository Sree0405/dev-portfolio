import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';

import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <About/>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
