import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendWebCommand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Sparkles } from "lucide-react";
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
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-medium text-muted-foreground">Request a Song</h4>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for any song..."
            value={song}
            onChange={(e) => setSong(e.target.value)}
            disabled={requestMutation.isPending}
            className="pr-4"
          />
        </div>
        <Button
          type="submit"
          disabled={requestMutation.isPending || !song.trim()}
          className="px-4"
        >
          {requestMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground/70 mt-2.5 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        Tip: Try "Song by Artist" for better matches
      </p>
    </div>
  );
}
