import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <main>
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
