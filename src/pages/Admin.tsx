import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LogOut, Shield } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Admin = () => {
  const {
    isAdmin,
    loading,
    discordUser,
    startDiscordAuth,
    handleCallback,
    logout,
  } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleCallback(code).then((success) => {
        if (success) {
          navigate("/admin", { replace: true });
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .order("display_order");

      const { data: projectsData } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("display_order");

      setSiteSettings(settings);
      setSkills(skillsData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    }
  };

  const saveSettings = async () => {
    if (!discordUser) return;

    try {
      setSaving(true);
      const { error } = await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "site_settings",
          data: {
            hero_title: siteSettings.hero_title,
            hero_subtitle: siteSettings.hero_subtitle,
            hero_description: siteSettings.hero_description,
            about_text: siteSettings.about_text,
          },
          id: siteSettings.id,
        },
      });

      if (error) throw error;
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="glass max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl gradient-text">
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Sign in with Discord to access the admin panel
            </p>
            <Button
              onClick={startDiscordAuth}
              variant="hero"
              className="w-full"
              size="lg"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Sign in with Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  console.log("skills", skills);
  console.log("projects", projects);
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Welcome, {discordUser?.username}
            </p>
          </div>
          <Button onClick={logout} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteSettings && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Hero Title
                      </label>
                      <Input
                        value={siteSettings.hero_title}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            hero_title: e.target.value,
                          })
                        }
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Hero Subtitle
                      </label>
                      <Input
                        value={siteSettings.hero_subtitle}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            hero_subtitle: e.target.value,
                          })
                        }
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Hero Description
                      </label>
                      <Textarea
                        value={siteSettings.hero_description}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            hero_description: e.target.value,
                          })
                        }
                        rows={3}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        About Text
                      </label>
                      <Textarea
                        value={siteSettings.about_text}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            about_text: e.target.value,
                          })
                        }
                        rows={6}
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      onClick={saveSettings}
                      variant="hero"
                      disabled={saving}
                      className="w-full"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Save Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Manage Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Skills management interface - Coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Manage Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Projects management interface - Coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
