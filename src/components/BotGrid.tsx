import { useBots } from "@/hooks/useBots";
import { BotCard } from "./BotCard";

export function BotGrid() {
  const { data, isLoading, isError, refetch, isFetching } = useBots();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground text-sm">Loading bots...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card rounded-xl p-8 max-w-sm mx-auto text-center">
        <p className="text-foreground font-semibold">Connection failed</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Unable to reach the bot server
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-5 h-9 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.bots || data.bots.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 max-w-sm mx-auto text-center">
        <p className="text-foreground font-semibold">No bots available</p>
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
    <div>
      {/* Stats */}
      <div className="flex items-center justify-between mb-5 text-sm">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            <span className="text-success font-semibold">{data.online_count}</span> online
          </span>
          <span>
            <span className="text-foreground font-semibold">{data.total}</span> total
          </span>
        </div>
        {isFetching && (
          <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedBots.map((bot) => (
          <BotCard key={bot.bot_id} bot={bot} />
        ))}
      </div>
    </div>
  );
}
