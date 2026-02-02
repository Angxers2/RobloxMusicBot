import { useQuery } from "@tanstack/react-query";
import { fetchQueue } from "@/lib/api";
import { ListMusic, Loader2, Music2, User, Clock } from "lucide-react";

export function QueueView() {
  const { data, isLoading } = useQuery({
    queryKey: ["queue"],
    queryFn: fetchQueue,
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const queue = data?.queue || [];

  if (queue.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/50 flex items-center justify-center">
          <ListMusic className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Queue is empty</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Request songs to add them here</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary">
            <ListMusic className="w-4 h-4 text-muted-foreground" />
          </div>
          <h4 className="text-sm font-semibold">Up Next</h4>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-medium">
          {queue.length} song{queue.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Queue List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {queue.slice(0, 5).map((item, index) => (
          <div
            key={item.position}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              index === 0
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20'
                : 'bg-secondary/40 hover:bg-secondary/60'
            }`}
          >
            {/* Position */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
              index === 0
                ? 'bg-primary text-white'
                : 'bg-secondary text-muted-foreground'
            }`}>
              {item.position}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1.5">
                {item.search_status === "searching" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                ) : (
                  <Music2 className={`w-3.5 h-3.5 shrink-0 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
                <span className="truncate">{item.resolved_name || item.song}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs text-muted-foreground truncate">
                  {item.resolved_artist || item.artist || 'Unknown Artist'}
                </p>
                <span className="text-muted-foreground/30">|</span>
                <p className="text-xs text-muted-foreground/70 flex items-center gap-1 shrink-0">
                  <User className="w-3 h-3" />
                  {item.username}
                </p>
              </div>
            </div>

            {/* Status indicator for first item */}
            {index === 0 && (
              <div className="shrink-0 flex items-center gap-1 text-[10px] text-primary font-medium">
                <Clock className="w-3 h-3" />
                Next
              </div>
            )}
          </div>
        ))}

        {/* More songs indicator */}
        {queue.length > 5 && (
          <div className="text-xs text-muted-foreground text-center py-3 border-t border-border/30 mt-3">
            <span className="px-3 py-1.5 rounded-full bg-secondary/50">
              +{queue.length - 5} more song{queue.length - 5 !== 1 ? 's' : ''} in queue
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
