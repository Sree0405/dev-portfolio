import { motion,AnimatePresence } from "framer-motion"

export default function SkillInspector({ skill, onClose }){

  if(!skill) return null

  return (

    <AnimatePresence>

      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >

        <motion.div
          initial={{ scale:.9 }}
          animate={{ scale:1 }}
          exit={{ scale:.9 }}
          className="bg-slate-900 p-8 border border-slate-700 rounded-xl w-[400px]"
        >

          <h3 className="text-xl font-bold mb-4">
            {skill}
          </h3>

          <p className="text-muted-foreground mb-6">
            Detailed engineering usage, architecture role, and project
            implementation can be described here.
          </p>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-primary text-primary rounded"
          >
            Close
          </button>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  )
}