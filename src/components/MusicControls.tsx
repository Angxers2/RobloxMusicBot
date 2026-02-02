import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { sendWebCommand, fetchNowPlaying } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  Trash2,
  Repeat,
  Shuffle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface MusicControlsProps {
  botId: string;
  username: string;
}

export function MusicControls({ botId, username }: MusicControlsProps) {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(100);
  const queryClient = useQueryClient();

  const { data: nowPlaying } = useQuery({
    queryKey: ["now-playing"],
    queryFn: fetchNowPlaying,
    refetchInterval: 2000,
  });

  // Sync volume from server
  useEffect(() => {
    if (nowPlaying?.volume !== undefined && nowPlaying.volume !== volume) {
      setVolume(nowPlaying.volume);
      setIsMuted(nowPlaying.volume === 0);
    }
  }, [nowPlaying?.volume]);

  const commandMutation = useMutation({
    mutationFn: ({ command, args }: { command: string; args?: string }) =>
      sendWebCommand(botId, username, command, args),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["now-playing"] });
        queryClient.invalidateQueries({ queryKey: ["queue"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to send command");
    },
  });

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    commandMutation.mutate({ command: "volume", args: newVolume.toString() });
  };

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      handleVolumeChange(previousVolume || 100);
    } else {
      setPreviousVolume(volume);
      handleVolumeChange(0);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();
  const isPlaying = nowPlaying?.is_playing;

  return (
    <div className="glass-card rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Playback</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-medium">
          Privileged
        </span>
      </div>

      {/* Main Controls */}
      <div className="flex justify-center items-center gap-4">
        {/* Shuffle (placeholder) */}
        <button
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          disabled
          title="Shuffle (coming soon)"
        >
          <Shuffle className="h-4 w-4" />
        </button>

        {/* Skip Back (placeholder) */}
        <button
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          disabled
          title="Previous (coming soon)"
        >
          <SkipBack className="h-5 w-5" />
        </button>

        {/* Play/Pause */}
        <Button
          variant={isPlaying ? "outline" : "default"}
          size="icon"
          className={`h-14 w-14 rounded-full transition-all duration-300 ${
            isPlaying
              ? "border-2 border-primary/50 hover:border-primary hover:bg-primary/10"
              : "shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
          }`}
          onClick={() =>
            commandMutation.mutate({ command: isPlaying ? "pause" : "unpause" })
          }
          disabled={commandMutation.isPending}
        >
          {commandMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        {/* Skip Forward */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-secondary transition-all hover:scale-105"
          onClick={() => commandMutation.mutate({ command: "skip" })}
          disabled={commandMutation.isPending}
        >
          <SkipForward className="h-5 w-5" />
        </Button>

        {/* Repeat (placeholder) */}
        <button
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          disabled
          title="Repeat (coming soon)"
        >
          <Repeat className="h-4 w-4" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg transition-all ${
              isMuted || volume === 0
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <VolumeIcon className="h-4 w-4" />
          </button>

          <div className="flex-1 relative group">
            {/* Track background */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              {/* Filled portion */}
              <div
                className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full transition-all duration-150"
                style={{ width: `${volume}%` }}
              />
            </div>

            {/* Actual input */}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* Thumb indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${volume}% - 8px)` }}
            />
          </div>

          <span className="text-xs font-medium text-muted-foreground w-10 text-right tabular-nums">
            {volume}%
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Secondary Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          onClick={() => commandMutation.mutate({ command: "clear" })}
          disabled={commandMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Queue
        </Button>
      </div>
    </div>
  );
}
