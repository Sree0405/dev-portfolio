import Projects from "@/components/projects/Projects";
import Footer from "@/components/Footer";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsProofLegend from "@/components/projects/ProjectsProofLegend";
import { PageShell } from "@/components/portfolio";

const ProjectsPage = () => {
  return (
    <>
      <PageShell>
        <ProjectsHero />
        <ProjectsProofLegend />
        <Projects />
      </PageShell>
      <Footer />
    </>
  );
};

export default ProjectsPage;
