import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function resolveMediaSrc(src: string | { default: string } | undefined) {
  if (!src) return undefined;
  return typeof src === "string" ? src : src.default;
}

export type PreviewFrame = "flat" | "float" | "bleed" | "device" | "soft";

type ProjectPreviewProps = {
  project: {
    title: string;
    image?: string | { default: string };
    video?: string | { default: string };
  };
  className?: string;
  /** Outer aspect / height control via className; frame styles the chrome. */
  frame?: PreviewFrame;
  /** Show subtle play/hover sheen */
  interactive?: boolean;
  priority?: boolean;
};

/**
 * Premium media stage — image first; video plays only while in viewport.
 */
export function ProjectPreview({
  project,
  className,
  frame = "float",
  interactive = true,
  priority = false,
}: ProjectPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const imageSrc = resolveMediaSrc(project.image);
  const videoSrc = resolveMediaSrc(project.video);
  const showVideo = Boolean(videoSrc) && !videoError && inView && loaded;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Reset error/loaded when the source changes (HMR / project swap)
  useEffect(() => {
    setLoaded(false);
    setVideoError(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || videoError) return;

    if (!inView) {
      video.pause();
      return;
    }

    const tryPlay = () => {
      void video.play().catch(() => {
        /* autoplay can be blocked — first frame still shows once loaded */
      });
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [inView, videoSrc, videoError]);

  const markReady = () => setLoaded(true);

  const shellClass = cn(
    "group relative h-full w-full min-h-[12rem] overflow-hidden bg-[hsl(var(--surface-2))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    frame === "bleed" && "rounded-none",
    frame === "flat" && "rounded-xl border border-primary/15",
    frame === "soft" && "rounded-2xl border border-primary/20",
    frame === "float" &&
      "rounded-2xl border border-primary/20 shadow-[0_24px_80px_-28px_hsl(var(--primary)/0.45),0_12px_40px_-20px_hsl(0_0%_0%/0.55)]",
    frame === "device" &&
      "rounded-[1.35rem] border border-primary/25 shadow-[0_28px_90px_-30px_hsl(var(--primary)/0.5),inset_0_1px_0_hsl(0_0%_100%/0.08)]",
    interactive &&
      "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out",
  );

  const media = (
    <div
      ref={rootRef}
      tabIndex={0}
      role="figure"
      aria-label={`${project.title} preview`}
      className={cn(shellClass, frame !== "float" && frame !== "device" && className)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "h-full w-full",
            interactive &&
              "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.035] motion-safe:group-focus-within:scale-[1.035]",
          )}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
                showVideo ? "opacity-0" : "opacity-100",
              )}
            />
          ) : null}

          {videoSrc && !videoError ? (
            <video
              ref={videoRef}
              // Keep src mounted so the browser can buffer once near viewport;
              // only play while in view (see effect above).
              src={videoSrc}
              poster={imageSrc}
              muted
              loop
              playsInline
              preload={inView || priority ? "metadata" : "none"}
              onLoadedData={markReady}
              onCanPlay={markReady}
              onError={() => setVideoError(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
                showVideo ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, hsl(var(--primary) / 0.18), transparent 55%)",
        }}
        aria-hidden
      />
    </div>
  );

  if (frame === "float" || frame === "device") {
    return (
      <div className={cn("relative w-full", className)}>
        <div
          className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-primary/[0.07] blur-2xl sm:-inset-4"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-2 left-[8%] right-[8%] h-8 rounded-full bg-background/40 blur-xl"
          aria-hidden
        />
        <div className="relative h-full min-h-[inherit] w-full">{media}</div>
      </div>
    );
  }

  return media;
}
