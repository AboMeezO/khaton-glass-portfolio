import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, MoveUp, MoveDown } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface ProjectsManagerProps {
  projects: Project[];
  discordUser: { id: string } | null;
  onUpdate: () => void;
}

export const ProjectsManager = ({ projects, discordUser, onUpdate }: ProjectsManagerProps) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  const handleEdit = (project: Project) => {
    setEditing(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
    });
  };

  const handleAdd = () => {
    setAdding(true);
    setFormData({ title: "", description: "", image_url: "" });
  };

  const handleCancel = () => {
    setEditing(null);
    setAdding(false);
    setFormData({ title: "", description: "", image_url: "" });
  };

  const handleSave = async () => {
    if (!discordUser || !formData.title.trim() || !formData.image_url.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setSaving(true);
      const maxOrder = Math.max(...projects.map(p => p.display_order), -1);
      
      const { error } = await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "portfolio_projects",
          data: {
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            display_order: adding ? maxOrder + 1 : undefined,
          },
          id: editing || undefined,
        },
      });

      if (error) throw error;
      
      toast.success(adding ? "تم إضافة المشروع بنجاح" : "تم تحديث المشروع بنجاح");
      handleCancel();
      onUpdate();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("فشل في حفظ المشروع");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!discordUser || !confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

    try {
      setSaving(true);
      const { error } = await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "portfolio_projects",
          data: { operation: "delete" },
          id,
        },
      });

      if (error) throw error;
      
      toast.success("تم حذف المشروع بنجاح");
      onUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("فشل في حذف المشروع");
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    if (!discordUser) return;

    const currentIndex = projects.findIndex(p => p.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === projects.length - 1)
    ) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const current = projects[currentIndex];
    const target = projects[targetIndex];

    try {
      setSaving(true);
      
      await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "portfolio_projects",
          data: { display_order: target.display_order },
          id: current.id,
        },
      });

      await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "portfolio_projects",
          data: { display_order: current.display_order },
          id: target.id,
        },
      });

      toast.success("تم تحديث الترتيب");
      onUpdate();
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("فشل في تحديث الترتيب");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المشاريع</h3>
        <Button onClick={handleAdd} variant="hero" size="sm" disabled={adding || editing !== null}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة مشروع
        </Button>
      </div>

      {adding && (
        <Card className="glass border-primary/20">
          <CardContent className="space-y-4 pt-6">
            <Input
              placeholder="عنوان المشروع"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background/50"
            />
            <Textarea
              placeholder="الوصف"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background/50"
            />
            <Input
              placeholder="رابط الصورة"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="bg-background/50"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="hero" disabled={saving} className="flex-1">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                حفظ
              </Button>
              <Button onClick={handleCancel} variant="ghost" className="flex-1">
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {projects.map((project, index) => (
          <Card key={project.id} className="glass">
            <CardContent className="p-4">
              {editing === project.id ? (
                <div className="space-y-4">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-background/50"
                  />
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background/50"
                  />
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-background/50"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} variant="hero" disabled={saving} className="flex-1">
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      حفظ
                    </Button>
                    <Button onClick={handleCancel} variant="ghost" className="flex-1">
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleReorder(project.id, "up")}
                      variant="ghost"
                      size="sm"
                      disabled={index === 0 || saving}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(project.id, "down")}
                      variant="ghost"
                      size="sm"
                      disabled={index === projects.length - 1 || saving}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleEdit(project)} variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(project.id)} variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
