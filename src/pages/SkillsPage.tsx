import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

import SkillsHero from "@/components/skills/SkillsHero";
import RadarVisualization from "@/components/skills/RadarVisualization";
import TechnologyExplorer from "@/components/skills/TechnologyExplorer";
import CapabilityArchitecture from "@/components/skills/CapabilityArchitecture";
import EmergingTech from "@/components/skills/EmergingTech";
import SkillInspector from "@/components/skills/SkillInspector";

const SkillsPage = () => {

  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">

      <Navigation />

      <main className="relative z-10">

        {/* PAGE CONTAINER */}
        <div
          className="
          mx-auto
          max-w-[1600px]
          px-5
          sm:px-8
          md:px-12
          lg:px-16
          xl:px-24
          "
        >

          {/* HERO */}
          <section className="pt-28  md:pt-36 ">
            <SkillsHero />
                      </section>

          {/* RADAR */}
            <RadarVisualization
              onSelectSkill={setSelectedSkill}
            />

          {/* TECH EXPLORER */}
            <TechnologyExplorer
              onSelectSkill={setSelectedSkill}
            />
          {/* ARCHITECTURE */}
            <CapabilityArchitecture />

          {/* EMERGING TECH */}
            <EmergingTech />

        </div>

        {/* SKILL INSPECTOR MODAL */}
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