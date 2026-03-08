const layers = [
  {
    title:"Frontend Systems",
    tech:["React","Next.js","TypeScript"]
  },
  {
    title:"Backend Systems",
    tech:["Node.js","Express","REST APIs"]
  },
  {
    title:"Interactive Interfaces",
    tech:["Three.js","Framer Motion"]
  },
  {
    title:"Mobile Platforms",
    tech:["React Native","Expo"]
  }
]

export default function CapabilityArchitecture(){

  return (

    <section className="mb-24">

      <h2 className="text-2xl font-semibold mb-10">
        System Architecture
      </h2>

      <div className="space-y-6">

        {layers.map(layer => (

          <div
            key={layer.title}
            className="p-6 border border-slate-700 rounded-xl bg-slate-900/70"
          >

            <h3 className="font-semibold mb-2 text-primary">
              {layer.title}
            </h3>

            <div className="flex flex-wrap gap-2">

              {layer.tech.map(t => (
                <span
                  key={t}
                  className="text-xs border border-slate-600 px-3 py-1 rounded"
                >
                  {t}
                </span>
              ))}

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}