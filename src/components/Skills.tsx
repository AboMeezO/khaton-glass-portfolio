import { useEffect, useState } from "react";
import { Palette, Layers, Smartphone, Code, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = {
  Palette,
  Layers,
  Smartphone,
  Code,
  Sparkles,
  Users,
};

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('display_order');
    
    if (data) {
      setSkills(data);
    }
  };

  return (
    <section className="py-32 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4 drop-shadow-lg">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for creating exceptional digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => {
            const Icon = iconMap[skill.icon_name] || Sparkles;
            return (
              <div
                key={skill.id}
                className="glass glass-hover rounded-2xl p-8 group cursor-pointer animate-scale-in hover:glow-effect"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <Icon className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {skill.name}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {skill.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
