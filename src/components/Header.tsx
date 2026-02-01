import { Music } from "lucide-react";

export function Header() {
  return (
    <header className="py-12 md:py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <Music className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-primary">Roblox</span>
          <span className="text-foreground">MusicBot</span>
        </h1>
        <p className="mt-3 text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Stream music in any Roblox game with our live bots
        </p>
      </div>
    </header>
  );
}
