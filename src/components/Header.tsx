import { Music, Terminal, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  return (
    <header className="py-8 md:py-12">
      {/* Navigation */}
      <nav className="flex justify-center gap-2 mb-8">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            location.pathname === "/"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Home className="w-4 h-4" />
          Bots
        </Link>
        <Link
          to="/commands"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            location.pathname === "/commands"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Commands
        </Link>
      </nav>

      {/* Logo & Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-4 shadow-lg shadow-primary/10 animate-in zoom-in duration-500">
          <Music className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent">Roblox</span>
          <span className="text-foreground">MusicBot</span>
        </h1>
        <p className="mt-3 text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700">
          Stream music in any Roblox game with our live bots
        </p>
      </div>
    </header>
  );
}
