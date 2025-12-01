import Navigation from '@/components/Navigation';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';

const SkillsPage = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <main>
        <Skills />
      </main>
      <Footer />
    </div>
  );
};

export default SkillsPage;
