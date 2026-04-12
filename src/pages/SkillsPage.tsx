import Footer from "@/components/Footer";
import { useState } from "react";

import SkillsHero from "@/components/skills/SkillsHero";
import RadarVisualization from "@/components/skills/RadarVisualization";
import TechnologyExplorer from "@/components/skills/TechnologyExplorer";
import CapabilityArchitecture from "@/components/skills/CapabilityArchitecture";
import EmergingTech from "@/components/skills/EmergingTech";
import SkillInspector from "@/components/skills/SkillInspector";

const SkillsPage = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <main className="relative z-10 pb-24">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <SkillsHero />

          <RadarVisualization onSelectSkill={setSelectedSkill} />

          <TechnologyExplorer onSelectSkill={setSelectedSkill} />

          <CapabilityArchitecture onSelectSkill={setSelectedSkill} />

          <EmergingTech onSelectSkill={setSelectedSkill} />

          <p className="mt-14 border-t border-border/40 pt-8 text-center text-xs leading-relaxed text-muted-foreground sm:mt-16 sm:pt-10 sm:text-sm">
            Java and Spring Boot are additional JVM experience. Deepest craft is
            frontend and product UX; Node.js and Express support APIs when
            shipping full-stack.
          </p>
        </div>

        <SkillInspector
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      </main>

      <Footer />
    </div>
  );
};

export default SkillsPage;
