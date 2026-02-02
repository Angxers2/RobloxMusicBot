import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendWebCommand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Sparkles, Music2 } from "lucide-react";
import { toast } from "sonner";

interface SongRequestProps {
  botId: string;
  username: string;
}

export function SongRequest({ botId, username }: SongRequestProps) {
  const [song, setSong] = useState("");
  const queryClient = useQueryClient();

  const requestMutation = useMutation({
    mutationFn: (songName: string) =>
      sendWebCommand(botId, username, "play", songName),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message, {
          icon: <Sparkles className="w-4 h-4 text-primary" />,
        });
        setSong("");
        queryClient.invalidateQueries({ queryKey: ["queue"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to request song");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!song.trim()) return;
    requestMutation.mutate(song.trim());
  };

  return (
    <div className="glass-card rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Music2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Request a Song</h4>
          <p className="text-[10px] text-muted-foreground">Add songs to the queue</p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for a song..."
            value={song}
            onChange={(e) => setSong(e.target.value)}
            disabled={requestMutation.isPending}
            className="pl-10 pr-4 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={requestMutation.isPending || !song.trim()}
          className="w-full h-10 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          {requestMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to Queue
            </>
          )}
        </Button>
      </form>

      {/* Tips */}
      <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/30">
        <p className="text-xs text-muted-foreground flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
          <span>
            <span className="font-medium text-foreground/80">Pro tip:</span> Use "Song by Artist" format for better matches. Example: "Payphone by Maroon 5"
          </span>
        </p>
      </div>
    </div>
  );
}
