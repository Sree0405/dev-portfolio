import Footer from "@/components/Footer";
import SkillsHero from "@/components/skills/SkillsHero";
import SkillsHowToRead from "@/components/skills/SkillsHowToRead";
import CoreExpertise from "@/components/skills/CoreExpertise";
import PrimaryStack from "@/components/skills/PrimaryStack";
import ProductsIBuild from "@/components/skills/ProductsIBuild";
import CurrentFocus from "@/components/skills/CurrentFocus";
import { PageShell } from "@/components/portfolio";

const SkillsPage = () => {
  return (
    <>
      <PageShell contained className="relative z-10 pb-12 sm:pb-16">
        <SkillsHero />
        <SkillsHowToRead />
        <PrimaryStack />
        <CoreExpertise />
        <ProductsIBuild />
        <CurrentFocus />
      </PageShell>
      <Footer />
    </>
  );
};

export default SkillsPage;
