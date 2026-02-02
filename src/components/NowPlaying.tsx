import { useQuery } from "@tanstack/react-query";
import { fetchNowPlaying, formatTime } from "@/lib/api";
import { Music, Pause, Disc3, Volume2 } from "lucide-react";

export function NowPlaying() {
  const { data } = useQuery({
    queryKey: ["now-playing"],
    queryFn: fetchNowPlaying,
    refetchInterval: 2000,
  });

  if (!data?.playing) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
            <Disc3 className="w-10 h-10 text-muted-foreground/30" />
          </div>
        </div>
        <p className="text-muted-foreground font-semibold">No song playing</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Request a song to get started</p>
      </div>
    );
  }

  const progress = data.duration ? (data.current_position! / data.duration) * 100 : 0;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex gap-4">
        {/* Album Art */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0 group shadow-lg">
          {data.album_art_url ? (
            <img
              src={data.album_art_url}
              alt={data.album_name || "Album"}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                data.is_playing ? "group-hover:scale-110" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Music className="w-10 h-10 text-primary/40" />
            </div>
          )}
          {/* Playing overlay */}
          {data.is_playing && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-end gap-1 h-6">
                <span className="w-1.5 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite]" style={{ height: '50%' }} />
                <span className="w-1.5 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                <span className="w-1.5 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.2s]" style={{ height: '40%' }} />
              </div>
            </div>
          )}
          {/* Vinyl effect when playing */}
          {data.is_playing && (
            <div className="absolute -inset-1 rounded-xl border border-primary/20 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 flex-1">
            <div className="min-w-0">
              <h3 className="font-bold text-lg truncate leading-tight">{data.song_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{data.artist_name}</p>
              {data.album_name && (
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{data.album_name}</p>
              )}
            </div>
            <div className="shrink-0">
              {data.is_playing ? (
                <div className="flex items-end gap-0.5 h-5 p-1.5 rounded-lg bg-primary/10">
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite]" style={{ height: '40%' }} />
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.2s]" style={{ height: '30%' }} />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-secondary">
                  <Pause className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-auto pt-3">
            <div className="group relative h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all">
              <div
                className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
              {/* Hover indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="tabular-nums">{formatTime(data.current_position || 0)}</span>
              <span className="tabular-nums">{formatTime(data.duration || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue info */}
      {data.queue_size !== undefined && data.queue_size > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <Volume2 className="w-3 h-3" />
          {data.queue_size} song{data.queue_size !== 1 ? 's' : ''} in queue
        </div>
      )}
    </div>
  );
}
