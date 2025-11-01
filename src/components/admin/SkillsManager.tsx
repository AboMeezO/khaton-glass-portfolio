import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, MoveUp, MoveDown } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
}

interface SkillsManagerProps {
  skills: Skill[];
  discordUser: { id: string } | null;
  onUpdate: () => void;
}

export const SkillsManager = ({ skills, discordUser, onUpdate }: SkillsManagerProps) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_name: "",
  });

  const handleEdit = (skill: Skill) => {
    setEditing(skill.id);
    setFormData({
      name: skill.name,
      description: skill.description,
      icon_name: skill.icon_name,
    });
  };

  const handleAdd = () => {
    setAdding(true);
    setFormData({ name: "", description: "", icon_name: "" });
  };

  const handleCancel = () => {
    setEditing(null);
    setAdding(false);
    setFormData({ name: "", description: "", icon_name: "" });
  };

  const handleSave = async () => {
    if (!discordUser || !formData.name.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setSaving(true);
      const maxOrder = Math.max(...skills.map(s => s.display_order), -1);
      
      const { error } = await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "skills",
          data: {
            name: formData.name,
            description: formData.description,
            icon_name: formData.icon_name,
            display_order: adding ? maxOrder + 1 : undefined,
          },
          id: editing || undefined,
        },
      });

      if (error) throw error;
      
      toast.success(adding ? "تم إضافة المهارة بنجاح" : "تم تحديث المهارة بنجاح");
      handleCancel();
      onUpdate();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("فشل في حفظ المهارة");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!discordUser || !confirm("هل أنت متأكد من حذف هذه المهارة؟")) return;

    try {
      setSaving(true);
      const { error } = await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "skills",
          data: { operation: "delete" },
          id,
        },
      });

      if (error) throw error;
      
      toast.success("تم حذف المهارة بنجاح");
      onUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("فشل في حذف المهارة");
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    if (!discordUser) return;

    const currentIndex = skills.findIndex(s => s.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === skills.length - 1)
    ) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const current = skills[currentIndex];
    const target = skills[targetIndex];

    try {
      setSaving(true);
      
      await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "skills",
          data: { display_order: target.display_order },
          id: current.id,
        },
      });

      await supabase.functions.invoke("admin-update", {
        body: {
          discordId: discordUser.id,
          table: "skills",
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
        <h3 className="text-lg font-semibold">المهارات</h3>
        <Button onClick={handleAdd} variant="hero" size="sm" disabled={adding || editing !== null}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة مهارة
        </Button>
      </div>

      {adding && (
        <Card className="glass border-primary/20">
          <CardContent className="space-y-4 pt-6">
            <Input
              placeholder="اسم المهارة"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background/50"
            />
            <Textarea
              placeholder="الوصف"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background/50"
            />
            <Input
              placeholder="اسم الأيقونة (مثل: Palette)"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
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
        {skills.map((skill, index) => (
          <Card key={skill.id} className="glass">
            <CardContent className="p-4">
              {editing === skill.id ? (
                <div className="space-y-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background/50"
                  />
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background/50"
                  />
                  <Input
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
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
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{skill.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{skill.description}</p>
                    <p className="text-xs text-muted-foreground">أيقونة: {skill.icon_name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleReorder(skill.id, "up")}
                      variant="ghost"
                      size="sm"
                      disabled={index === 0 || saving}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(skill.id, "down")}
                      variant="ghost"
                      size="sm"
                      disabled={index === skills.length - 1 || saving}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleEdit(skill)} variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(skill.id)} variant="ghost" size="sm">
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
