import { SectionTitle } from "@/components/ui/page-title";
import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";
import { currentFocus } from "./skillsData";

export default function CurrentFocus() {
  return (
    <section className="py-10 sm:py-12 border-t border-primary/10">
      <div className="page-container-x">
        <Reveal>
          <SectionTitle
            eyebrow="Learning"
            accent="Current"
            rest="focus"
            className="mb-3 text-center md:mb-4 [&_h2]:text-center"
          />
          <p className="mx-auto mb-6 max-w-xl text-center text-sm portfolio-text-muted md:mb-8">
            Growth edges tied to real work — not a wishlist of buzzwords.
          </p>
        </Reveal>

        <Stagger
          className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-5"
          stagger={0.06}
          delayChildren={0.06}
        >
          {currentFocus.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <PortfolioCard className="flex h-full flex-col text-left">
                <h3 className="page-title-accent text-sm font-semibold leading-snug sm:text-[15px]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed portfolio-text-muted">
                  {item.detail}
                </p>
              </PortfolioCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
