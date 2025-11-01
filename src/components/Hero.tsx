import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [settings, setSettings] = useState({
    hero_title: "Khaton",
    hero_subtitle: "Creative Designer & Digital Artist",
    hero_description: "Crafting stunning visual experiences that blend creativity with purpose."
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('hero_title, hero_subtitle, hero_description')
      .single();
    
    if (data) {
      setSettings(data);
    }
  };

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 gradient-bg opacity-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold gradient-text leading-tight drop-shadow-2xl">
              {settings.hero_title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {settings.hero_subtitle}
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {settings.hero_description}
            </p>
          </div>
          
          <Button 
            variant="hero" 
            size="lg" 
            onClick={scrollToPortfolio}
            className="group animate-fade-in glow-effect"
            style={{ animationDelay: '0.6s' }}
          >
            View My Work
            <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative animate-fade-in-delay">
          <div className="glass rounded-3xl p-2 glow-effect overflow-hidden hover:scale-105 transition-transform duration-700">
            <img 
              src={heroImage} 
              alt="Khaton's creative work" 
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary rounded-full blur-3xl opacity-60 animate-glow"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-60 animate-glow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
