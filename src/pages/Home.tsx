import Hero from '@/components/Hero';
import About from '@/components/About';
import ReviewerPath from '@/components/ReviewerPath';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import Projects from '@/components/projects/Projects';
import { PageShell } from '@/components/portfolio';

const Home = () => {
  return (
    <>
      <PageShell>
        <Hero />
        <About />
        <ReviewerPath />
        <Reviews />
        <Projects homepage={true} />
      </PageShell>
      <Footer />
    </>
  );
};

export default Home;
