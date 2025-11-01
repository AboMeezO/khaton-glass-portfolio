-- Create content management tables

-- Table for site settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT NOT NULL DEFAULT 'Khaton',
  hero_subtitle TEXT NOT NULL DEFAULT 'Creative Designer & Digital Artist',
  hero_description TEXT NOT NULL DEFAULT 'Crafting stunning visual experiences that blend creativity with purpose.',
  about_text TEXT NOT NULL DEFAULT 'I''m Khaton, a passionate designer...',
  discord_server_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for skills
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for portfolio projects
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for admin users (Discord-based)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,
  discord_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.portfolio_projects FOR SELECT USING (true);

-- RLS Policies: Only admins can modify (will be enforced via edge functions)
CREATE POLICY "Service role can manage site settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Service role can manage skills" ON public.skills FOR ALL USING (true);
CREATE POLICY "Service role can manage projects" ON public.portfolio_projects FOR ALL USING (true);
CREATE POLICY "Service role can manage admins" ON public.admin_users FOR ALL USING (true);

-- Insert default site settings
INSERT INTO public.site_settings (hero_title, hero_subtitle, hero_description, about_text)
VALUES (
  'Khaton',
  'Creative Designer & Digital Artist',
  'Crafting stunning visual experiences that blend creativity with purpose. Specializing in modern design, UI/UX, and digital artistry.',
  'I''m Khaton, a passionate designer who believes that great design is more than aesthetics—it''s about creating meaningful connections between people and experiences. With years of experience in digital design, I''ve helped brands and individuals bring their visions to life through thoughtful, user-centered design.'
);

-- Insert default skills
INSERT INTO public.skills (name, description, icon_name, display_order) VALUES
('Photoshop', 'Advanced photo editing and manipulation', 'Palette', 0),
('Illustrator', 'Vector graphics and illustration', 'Layers', 1),
('UI/UX Design', 'User-centered interface design', 'Smartphone', 2),
('Web Design', 'Modern responsive web layouts', 'Code', 3),
('Motion Design', 'Engaging animations and transitions', 'Sparkles', 4),
('Brand Identity', 'Complete brand design systems', 'Users', 5);

-- Insert default projects
INSERT INTO public.portfolio_projects (title, description, image_url, display_order) VALUES
('Brand Identity Design', 'Complete brand system for a tech startup', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=800&fit=crop', 0),
('Mobile App UI', 'Modern fintech application interface', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=800&fit=crop', 1),
('Website Redesign', 'E-commerce platform visual overhaul', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=800&fit=crop', 2),
('Digital Illustration', 'Custom artwork for editorial content', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=800&fit=crop', 3),
('Motion Graphics', 'Animated brand presentation', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop', 4),
('Social Media Design', 'Engaging content for marketing campaigns', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=800&fit=crop', 5);

-- Insert the admin user with Discord ID
INSERT INTO public.admin_users (discord_id, discord_username)
VALUES ('581617415444627477', 'Admin');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();