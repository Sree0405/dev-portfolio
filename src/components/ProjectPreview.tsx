import { useState } from "react";

export function ProjectPreview({ project }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative h-[320px] rounded-2xl overflow-hidden border border-primary/20 shadow-xl">

      {/* IMAGE PLACEHOLDER */}
      {!ready && project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-[320px] object-cover"
        />
      )}

      {/* VIDEO */}
      {project.video && (
        <video
          src={project.video}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className={`w-full h-[320px] object-cover transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Hover Overlay */}
      <div className="absolute h-[320px] inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
        {/* buttons */}
      </div>

    </div>
  );
}
