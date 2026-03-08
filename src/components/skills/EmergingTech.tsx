const emerging = [
  "AI Agents",
  "WebGPU",
  "Edge Functions",
  "Distributed Systems"
]

export default function EmergingTech(){

  return (

    <section className="mb-24">

      <h2 className="text-2xl font-semibold mb-10">
        Currently Exploring
      </h2>

      <div className="flex flex-wrap gap-4">

        {emerging.map(t => (

          <span
            key={t}
            className="px-4 py-2 rounded border border-primary text-primary"
          >
            {t}
          </span>

        ))}

      </div>

    </section>
  )
}