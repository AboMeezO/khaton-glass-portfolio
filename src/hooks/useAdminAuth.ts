import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    const storedUser = localStorage.getItem("discord_user");
    const adminVerified = sessionStorage.getItem("admin_verified");

    if (storedUser && adminVerified === "true") {
      const user = JSON.parse(storedUser);
      setDiscordUser(user);
      setIsAdmin(true);
    }

    setLoading(false);
  };

  const startDiscordAuth = () => {
    const clientId =
      import.meta.env.VITE_DISCORD_CLIENT_ID || "1360730497948586247";
    const redirectUri = encodeURIComponent(`${window.location.origin}/admin`);
    const scope = encodeURIComponent("identify");

    const authUrl = `https://discord.com/api/oauth2/authorize?prompt=none&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&`;
    window.location.href = authUrl;
  };

  const handleCallback = async (code: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke("discord-auth", {
        body: {
          code,
          redirectUri: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;

      if (data.success && data.user) {
        // Check if user is admin
        const { data: adminCheck, error: adminError } =
          await supabase.functions.invoke("admin-check", {
            body: { discordId: data.user.id },
          });

        if (adminError) throw adminError;

        if (adminCheck.isAdmin) {
          localStorage.setItem("discord_user", JSON.stringify(data.user));
          sessionStorage.setItem("admin_verified", "true");
          setDiscordUser(data.user);
          setIsAdmin(true);
          return true;
        } else {
          throw new Error("Not authorized as admin");
        }
      }

      return false;
    } catch (error) {
      console.error("Auth callback error:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("discord_user");
    sessionStorage.removeItem("admin_verified");
    setDiscordUser(null);
    setIsAdmin(false);
  };

  return {
    isAdmin,
    loading,
    discordUser,
    startDiscordAuth,
    handleCallback,
    logout,
  };
};
