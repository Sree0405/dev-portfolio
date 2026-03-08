import Navigation from '@/components/Navigation';
import Projects from '@/components/projects/Projects';
import Footer from '@/components/Footer';
import ProjectsHero from "@/components/projects/ProjectsHero";
const ProjectsPage = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      <Navigation />
      <main>
        <ProjectsHero/>
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
