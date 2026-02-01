import { useQuery } from "@tanstack/react-query";
import { fetchQueue } from "@/lib/api";
import { ListMusic, Loader2, Music2, User } from "lucide-react";

export function QueueView() {
  const { data, isLoading } = useQuery({
    queryKey: ["queue"],
    queryFn: fetchQueue,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const queue = data?.queue || [];

  if (queue.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5 text-center">
        <ListMusic className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground font-medium">Queue is empty</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Request songs to add them here</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <ListMusic className="w-4 h-4" />
          Up Next
        </h4>
        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
          {queue.length} song{queue.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {queue.slice(0, 5).map((item, index) => (
          <div
            key={item.position}
            className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
              index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50 hover:bg-secondary/70'
            }`}
          >
            <span className={`text-xs font-bold w-5 text-center ${
              index === 0 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {item.position}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1.5">
                {item.search_status === "searching" ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground shrink-0" />
                ) : (
                  <Music2 className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                {item.resolved_name || item.song}
              </p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                {item.resolved_artist || item.artist}
                <span className="text-muted-foreground/50">•</span>
                <User className="w-3 h-3 inline" />
                {item.username}
              </p>
            </div>
          </div>
        ))}
        {queue.length > 5 && (
          <div className="text-xs text-muted-foreground text-center py-2 border-t border-border/50 mt-2">
            +{queue.length - 5} more song{queue.length - 5 !== 1 ? 's' : ''} in queue
          </div>
        )}
      </div>
    </div>
  );
}
