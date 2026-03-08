import { SiReact,SiNextdotjs,SiTypescript,SiNodedotjs,SiThreedotjs } from "react-icons/si"
import { motion } from "framer-motion"

const tech = [
  { name:"React", icon:SiReact },
  { name:"Next.js", icon:SiNextdotjs },
  { name:"TypeScript", icon:SiTypescript },
  { name:"Node.js", icon:SiNodedotjs },
  { name:"Three.js", icon:SiThreedotjs },
]

export default function TechnologyExplorer({ onSelectSkill }) {

  return (
    <section className="mb-24">

      <h2 className="text-2xl font-semibold mb-10">
        Technology Explorer
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

        {tech.map(t => {

          const Icon = t.icon

          return (

            <motion.div
              key={t.name}
              whileHover={{ scale:1.08 }}
              onClick={() => onSelectSkill(t.name)}
              className="cursor-pointer p-6 rounded-xl border border-slate-700
              flex flex-col items-center gap-3 bg-slate-900/70"
            >

              <Icon className="text-3xl text-primary"/>

              <span className="text-sm">
                {t.name}
              </span>

            </motion.div>

          )

        })}

      </div>

    </section>
  )
}