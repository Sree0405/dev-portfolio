import Projects from "@/components/projects/Projects";
import Footer from "@/components/Footer";
import ProjectsHero from "@/components/projects/ProjectsHero";

const ProjectsPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden portfolio-text-muted">
      <main>
        <ProjectsHero />
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
