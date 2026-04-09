import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <main>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
