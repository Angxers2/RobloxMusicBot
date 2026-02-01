import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { sendWebCommand, fetchNowPlaying } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, Volume2, VolumeX, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MusicControlsProps {
  botId: string;
  username: string;
}

export function MusicControls({ botId, username }: MusicControlsProps) {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const queryClient = useQueryClient();

  const { data: nowPlaying } = useQuery({
    queryKey: ["now-playing"],
    queryFn: fetchNowPlaying,
    refetchInterval: 2000,
  });

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
    if (isMuted) {
      handleVolumeChange(100);
    } else {
      handleVolumeChange(0);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Playback Controls</h4>

      {/* Main Controls */}
      <div className="flex justify-center items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full transition-transform hover:scale-105"
          onClick={() => commandMutation.mutate({ command: "pause" })}
          disabled={commandMutation.isPending}
        >
          <Pause className="h-5 w-5" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full transition-transform hover:scale-105 shadow-lg shadow-primary/25"
          onClick={() => commandMutation.mutate({ command: "unpause" })}
          disabled={commandMutation.isPending}
        >
          <Play className="h-6 w-6 ml-0.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full transition-transform hover:scale-105"
          onClick={() => commandMutation.mutate({ command: "skip" })}
          disabled={commandMutation.isPending}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 px-2">
        <button
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
      </div>

      {/* Clear Queue Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-destructive"
        onClick={() => commandMutation.mutate({ command: "clear" })}
        disabled={commandMutation.isPending}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clear Queue
      </Button>
    </div>
  );
}
