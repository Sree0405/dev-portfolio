import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
}

export function CountUp({
  value,
  duration = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
  formatter,
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    startRef.current = undefined;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  const formatted = formatter
    ? formatter(display)
    : `${prefix}${decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-IN")}${suffix}`;

  return <span className={className}>{formatted}</span>;
}
