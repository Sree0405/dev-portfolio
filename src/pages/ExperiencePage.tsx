import Navigation from '@/components/Navigation';
import Experience from '@/components/Experience';
import Footer from '@/components/Footer';

const ExperiencePage = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      <Navigation />
      <main>
        <Experience />
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;
