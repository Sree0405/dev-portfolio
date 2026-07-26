import { useState } from "react";

function resolveMediaSrc(src: string | { default: string } | undefined) {
  if (!src) return undefined;
  return typeof src === "string" ? src : src.default;
}

export function ProjectPreview({ project, compact = false }) {
  const [loaded, setLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const imageSrc = resolveMediaSrc(project.image);
  const videoSrc = resolveMediaSrc(project.video);
  const showVideo = Boolean(videoSrc) && !videoError;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border/50 shadow-lg ${
        compact ? "h-[220px] sm:h-[240px]" : "h-[260px] sm:h-[300px]"
      }`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={project.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            showVideo && loaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {showVideo && (
        <video
          src={videoSrc}
          poster={imageSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
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