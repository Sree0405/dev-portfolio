import { motion } from "framer-motion"

const radarLevels = [
  { name: "Core", skills:["React","Next.js","TypeScript"] },
  { name: "Advanced", skills:["Three.js","Framer Motion","Node.js"] },
  { name: "Supporting", skills:["Docker","Git","CI/CD"] },
  { name: "Emerging", skills:["AI Integration"] }
]

export default function RadarVisualization({ onSelectSkill }) {

  return (
    <section className="mb-24">

      <h2 className="text-2xl font-semibold mb-10">
        Technology Radar
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {radarLevels.map(level => (

          <div key={level.name}
          className="p-6 border border-slate-700 rounded-xl bg-slate-900/60">

            <h3 className="font-semibold mb-4 text-primary">
              {level.name}
            </h3>

            <div className="flex flex-wrap gap-2">

              {level.skills.map(skill => (

                <motion.button
                  key={skill}
                  whileHover={{ scale:1.1 }}
                  onClick={() => onSelectSkill(skill)}
                  className="text-xs px-3 py-1 rounded border border-slate-600"
                >
                  {skill}
                </motion.button>

              ))}

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}