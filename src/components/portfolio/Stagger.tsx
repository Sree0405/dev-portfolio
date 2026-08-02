import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { Children, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const StaggerContext = createContext(false);

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
};

export function Stagger({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0,
  once = true,
  ...props
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <StaggerContext.Provider value={true}>
        <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      </StaggerContext.Provider>
    );
  }

  return (
    <StaggerContext.Provider value={false}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: "-64px" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: Math.min(stagger, 0.06),
              delayChildren,
            },
          },
        }}
        className={cn(className)}
        {...props}
      >
        {Children.map(children, (child) => child)}
      </motion.div>
    </StaggerContext.Provider>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  y?: number;
};

export function StaggerItem({
  children,
  className,
  y = 24,
  ...props
}: StaggerItemProps) {
  const reducedParent = useContext(StaggerContext);
  const reduce = useReducedMotion();

  if (reduce || reducedParent) {
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
