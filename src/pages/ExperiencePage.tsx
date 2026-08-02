import Experience from "@/components/experience/Experience";
import ExperienceHero from "@/components/experience/ExperienceHero";
import Footer from "@/components/Footer";
import { PageShell } from "@/components/portfolio";

const ExperiencePage = () => {
  return (
    <>
      <PageShell>
        <ExperienceHero />
        <Experience />
      </PageShell>
      <Footer />
    </>
  );
};

export default ExperiencePage;
