import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import ReviewsHero from "@/components/reviews/ReviewsHero";
import { PageShell } from "@/components/portfolio";

const ReviewsPage = () => {
  return (
    <>
      <PageShell>
        <ReviewsHero />
        <Reviews />
      </PageShell>
      <Footer />
    </>
  );
};

export default ReviewsPage;
