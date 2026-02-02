import { Header } from "@/components/Header";
import { Shield, Users, Music2, Gamepad2, Bot, MessageSquare, Volume2, Settings } from "lucide-react";

interface Command {
  name: string;
  aliases: string[];
  description: string;
  privileged: boolean;
  category: "music" | "movement" | "admin" | "ai" | "other";
}

const commands: Command[] = [
  // Music Commands
  { name: "!play", aliases: ["!p"], description: "Queue a song to play", privileged: false, category: "music" },
  { name: "!forceplay", aliases: ["!fp"], description: "Play a song immediately (skips queue)", privileged: true, category: "music" },
  { name: "!pause", aliases: ["!stop", "!ps"], description: "Pause the current song", privileged: false, category: "music" },
  { name: "!unpause", aliases: ["!resume", "!u"], description: "Resume playback", privileged: false, category: "music" },
  { name: "!skip", aliases: ["!sk"], description: "Skip to the next song", privileged: false, category: "music" },
  { name: "!queue", aliases: ["!q"], description: "View the current queue", privileged: false, category: "music" },
  { name: "!volume", aliases: ["!v"], description: "Set volume level (0-100)", privileged: true, category: "music" },
  { name: "!like", aliases: ["!l"], description: "Like the current song", privileged: false, category: "music" },

  // Movement Commands
  { name: "!tp", aliases: ["!teleport", "!t"], description: "Teleport bot to a player", privileged: true, category: "movement" },
  { name: "!follow", aliases: ["!fw"], description: "Follow a player", privileged: true, category: "movement" },
  { name: "!unfollow", aliases: ["!ufw"], description: "Stop following", privileged: true, category: "movement" },
  { name: "!headsit", aliases: ["!hs"], description: "Sit on player's head", privileged: true, category: "movement" },
  { name: "!dance", aliases: ["!d"], description: "Start dancing", privileged: false, category: "movement" },
  { name: "!undance", aliases: ["!stopdance", "!ud"], description: "Stop dancing", privileged: false, category: "movement" },
  { name: "!jump", aliases: ["!j"], description: "Make bot jump", privileged: true, category: "movement" },
  { name: "!walkspeed", aliases: ["!ws", "!speed", "!w"], description: "Set walk speed", privileged: true, category: "movement" },
  { name: "!noclip", aliases: ["!nc", "!n"], description: "Toggle noclip mode", privileged: true, category: "movement" },
  { name: "!fly", aliases: ["!fl"], description: "Toggle fly mode", privileged: true, category: "movement" },
  { name: "!reset", aliases: ["!respawn", "!r"], description: "Reset character", privileged: true, category: "movement" },
  { name: "!jumppower", aliases: [], description: "Modify jump power", privileged: true, category: "movement" },

  // Admin Commands
  { name: "!blacklist", aliases: ["!bl"], description: "Blacklist a user from bot", privileged: true, category: "admin" },
  { name: "!unblacklist", aliases: ["!ubl"], description: "Remove user from blacklist", privileged: true, category: "admin" },
  { name: "!switchacc", aliases: ["!sacc"], description: "Switch bot account", privileged: true, category: "admin" },
  { name: "!rejoin", aliases: ["!rj"], description: "Rejoin the server", privileged: true, category: "admin" },
  { name: "!turnoff", aliases: ["!to"], description: "Shutdown the bot", privileged: true, category: "admin" },

  // AI Commands
  { name: "!ai", aliases: ["!a"], description: "Chat with AI (proximity based)", privileged: false, category: "ai" },
  { name: "!enableai", aliases: ["!ea"], description: "Enable AI mode", privileged: true, category: "ai" },
  { name: "!disableai", aliases: ["!da"], description: "Disable AI mode", privileged: true, category: "ai" },

  // Other Commands
  { name: "!say", aliases: ["!speak", "!s"], description: "Send message to chat", privileged: true, category: "other" },
  { name: "!fart", aliases: ["!f"], description: "Play fart sound", privileged: false, category: "other" },
  { name: "!burp", aliases: ["!b"], description: "Play burp sound", privileged: false, category: "other" },
  { name: "!commands", aliases: ["!cmds", "!help", "!h"], description: "Show help", privileged: false, category: "other" },
];

const categoryConfig = {
  music: { icon: Music2, label: "Music", color: "text-red-400" },
  movement: { icon: Gamepad2, label: "Movement", color: "text-blue-400" },
  admin: { icon: Settings, label: "Admin", color: "text-yellow-400" },
  ai: { icon: Bot, label: "AI", color: "text-purple-400" },
  other: { icon: MessageSquare, label: "Other", color: "text-green-400" },
};

function CommandCard({ command }: { command: Command }) {
  const config = categoryConfig[command.category];
  const Icon = config.icon;

  return (
    <div className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-sm font-bold text-primary">{command.name}</code>
            {command.privileged ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-semibold">
                <Shield className="w-2.5 h-2.5" />
                Privileged
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-semibold">
                <Users className="w-2.5 h-2.5" />
                Everyone
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{command.description}</p>
          {command.aliases.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {command.aliases.map((alias) => (
                <code
                  key={alias}
                  className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                >
                  {alias}
                </code>
              ))}
            </div>
          )}
        </div>
        <div className={`shrink-0 ${config.color} opacity-50 group-hover:opacity-100 transition-opacity`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, label }: { category: string; label: string }) {
  const config = categoryConfig[category as keyof typeof categoryConfig];
  const Icon = config.icon;
  const categoryCommands = commands.filter((c) => c.category === category);
  const publicCount = categoryCommands.filter((c) => !c.privileged).length;
  const privilegedCount = categoryCommands.filter((c) => c.privileged).length;

  return (
    <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-secondary ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{label}</h2>
          <p className="text-xs text-muted-foreground">
            {publicCount} public, {privilegedCount} privileged
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {categoryCommands.map((command) => (
          <CommandCard key={command.name} command={command} />
        ))}
      </div>
    </section>
  );
}

const Commands = () => {
  const publicCommands = commands.filter((c) => !c.privileged);
  const privilegedCommands = commands.filter((c) => c.privileged);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Header />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 text-center animate-in fade-in slide-in-from-left duration-500">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 mb-2">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{publicCommands.length}</p>
            <p className="text-xs text-muted-foreground">Public Commands</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center animate-in fade-in slide-in-from-right duration-500">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 mb-2">
              <Shield className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{privilegedCommands.length}</p>
            <p className="text-xs text-muted-foreground">Privileged Commands</p>
          </div>
        </div>

        {/* Privilege Explanation */}
        <div className="glass-card rounded-xl p-4 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-start gap-3">
            <div className="shrink-0 p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">About Privileges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-green-500 font-medium">Public commands</span> can be used by anyone in the server.{" "}
                <span className="text-yellow-500 font-medium">Privileged commands</span> require special access granted by the bot operator.
                Contact the operator to request privileged access.
              </p>
            </div>
          </div>
        </div>

        {/* Command Categories */}
        {Object.entries(categoryConfig).map(([key, config]) => (
          <CategorySection key={key} category={key} label={config.label} />
        ))}
      </div>
    </div>
  );
};

export default Commands;
