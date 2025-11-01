import Hero from "@/components/Hero";
import DiscordWidget from "@/components/DiscordWidget";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminButton from "@/components/AdminButton";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Hero />
      <DiscordWidget />
      <Skills />
      <Portfolio />
      <About />
      <Contact />
      <Footer />
      <AdminButton />
    </div>
  );
};

export default Index;
