import { useEffect, useState } from "react";
import { Users, Wifi } from "lucide-react";

interface DiscordData {
  name: string;
  presence_count: number;
  member_count: number;
  icon_url?: string;
}

const DiscordWidget = () => {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Discord server data
    // Note: The actual API endpoint would need CORS enabled or use a proxy
    const fetchDiscordData = async () => {
      try {
        // For demo purposes, using placeholder data
        // In production, you'd fetch from: https://discord.com/api/guilds/GUILD_ID/widget.json
        setDiscordData({
          name: "VAS Community",
          presence_count: 147,
          member_count: 1523,
          icon_url: "https://cdn.discordapp.com/icons/example/example.png",
        });
      } catch (error) {
        console.error("Failed to fetch Discord data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="glass rounded-2xl p-8 animate-pulse">
            <div className="h-24 bg-white/5 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-2xl">
        <a 
          href="https://discord.gg/vas" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="glass glass-hover rounded-2xl p-8 group cursor-pointer animate-scale-in">
            <div className="flex items-center gap-6">
              {/* Discord Icon/Logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>

              {/* Server Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 gradient-text">
                  {discordData?.name || "Join Our Community"}
                </h3>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {discordData?.presence_count || 0} Online
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {discordData?.member_count || 0} Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Join Button Indicator */}
              <div className="hidden md:flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Join</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default DiscordWidget;
