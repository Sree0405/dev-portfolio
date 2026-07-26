import { cn } from "@/lib/utils";

type PageTitleProps = {
  eyebrow?: string;
  accent: string;
  rest?: string;
  className?: string;
  titleClassName?: string;
  align?: "center" | "left";
};

export function PageTitle({
  eyebrow,
  accent,
  rest,
  className,
  titleClassName,
  align = "center",
}: PageTitleProps) {
  const centered = align === "center";

  return (
    <div className={cn("w-full", centered && "text-center", className)}>
      {eyebrow ? (
        <p className={cn("section-eyebrow mb-3", centered && "text-center")}>{eyebrow}</p>
      ) : null}
      <h1
        className={cn(
          "page-title",
          centered && "page-title--center text-center",
          titleClassName,
        )}
      >
        <span className="page-title-accent">{accent}</span>
        {rest ? <> {rest}</> : null}
      </h1>
    </div>
  );
}

type SectionTitleProps = {
  eyebrow?: string;
  accent?: string;
  rest?: string;
  children?: React.ReactNode;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  accent,
  rest,
  children,
  className,
}: SectionTitleProps) {
  const title = children ?? (
    <>
      {accent ? <span className="page-title-accent">{accent}</span> : null}
      {rest ? (
        <>
          {accent ? " " : null}
          {rest}
        </>
      ) : null}
    </>
  );

  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      {eyebrow ? <p className="section-eyebrow mb-2">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
