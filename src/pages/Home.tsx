import Hero from '@/components/Hero';
import About from '@/components/About';

import Footer from '@/components/Footer';
import Projects from '@/components/projects/Projects';
const Home = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
