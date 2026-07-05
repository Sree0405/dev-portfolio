import Experience from "@/components/experience/Experience";
import ExperienceHero from "@/components/experience/ExperienceHero";
import Footer from "@/components/Footer";

const ExperiencePage = () => {
  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-x-clip text-foreground">
      <main>
        <ExperienceHero />
        <Experience />
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;
