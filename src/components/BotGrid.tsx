import { useBots } from "@/hooks/useBots";
import { BotCard } from "./BotCard";
import { RefreshCw, AlertCircle, Radio } from "lucide-react";

export function BotGrid() {
  const { data, isLoading, isError, refetch, isFetching } = useBots();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-6 text-muted-foreground text-sm font-medium">Loading bots...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card rounded-2xl p-8 max-w-sm mx-auto text-center animate-in fade-in zoom-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <p className="text-foreground font-bold text-lg">Connection failed</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Unable to reach the bot server
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-secondary text-sm font-semibold hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!data?.bots || data.bots.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 max-w-sm mx-auto text-center animate-in fade-in zoom-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <Radio className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-foreground font-bold text-lg">No bots available</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Check back soon for active music bots
        </p>
      </div>
    );
  }

  // Sort: online bots first
  const sortedBots = [...data.bots].sort((a, b) => {
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;
    return 0;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-secondary/30 border border-border/30">
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
            <span className="text-muted-foreground">
              <span className="text-green-500 font-bold">{data.online_count}</span> online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-bold">{data.total}</span> total
            </span>
          </div>
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedBots.map((bot, index) => (
          <div
            key={bot.bot_id}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BotCard bot={bot} />
          </div>
        ))}
      </div>
    </div>
  );
}
