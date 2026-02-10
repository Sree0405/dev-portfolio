import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';

import Footer from '@/components/Footer';
import Projects from '@/components/Projects';
const Home = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <About/>
        <Projects homepage={true}/>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
