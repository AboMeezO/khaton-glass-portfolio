import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleDiscordDM = () => {
    window.open("https://discord.com/users/581617415444627477", "_blank");
  };

  return (
    <section className="py-32 px-6 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground text-lg">
            Have a project in mind? I'd love to hear about it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-background/50 border-white/10 resize-none"
                />
              </div>
              <Button type="submit" variant="hero" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Discord DM Card */}
          <div className="glass rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Prefer Discord?</h3>
              <p className="text-muted-foreground">
                Send me a direct message for a quick response
              </p>
            </div>
            <Button variant="glass" size="lg" onClick={handleDiscordDM}>
              Message on Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
