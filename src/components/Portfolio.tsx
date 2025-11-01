import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Portfolio = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order');
    
    if (data) {
      setProjects(data);
    }
  };

  return (
    <section id="portfolio" className="py-32 px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4 drop-shadow-lg">
            Featured Work
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my recent projects and creative explorations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="relative aspect-square rounded-2xl overflow-hidden glass glass-hover cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 transition-opacity duration-500 ${
                  hoveredId === project.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2 transform transition-transform duration-500 ${hoveredId === project.id ? 'translate-y-0' : 'translate-y-4'}">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm transform transition-transform duration-500 delay-75 ${hoveredId === project.id ? 'translate-y-0' : 'translate-y-4'}">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
