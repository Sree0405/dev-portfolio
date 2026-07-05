import { useState } from "react";

export function ProjectPreview({ project, compact = false }) {

  const [loaded, setLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const showVideo = project.video && !videoError;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border/50 shadow-lg ${
        compact ? "h-[220px] sm:h-[240px]" : "h-[260px] sm:h-[300px]"
      }`}
    >

      {/* Image fallback */}
      <img
        src={project.image}
        alt={project.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video */}
      {showVideo && (
        <video
          src={project.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold">
        View Project
      </div>

    </div>
  );
}