import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    loadAboutText();
  }, []);

  const loadAboutText = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('about_text')
      .single();
    
    if (data) {
      setAboutText(data.about_text);
    }
  };

  return (
    <section className="py-32 px-6 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden animate-fade-in hover:glow-effect transition-all duration-700">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-primary animate-glow" />
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                About Me
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
