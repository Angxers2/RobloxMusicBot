import { useState } from "react";
import { Bot, getJoinUrl, formatLastSeen } from "@/lib/api";
import { ControlPanelModal } from "./ControlPanelModal";
import { Settings2, Users, Music2, ExternalLink, Disc3 } from "lucide-react";

interface BotCardProps {
  bot: Bot;
}

export function BotCard({ bot }: BotCardProps) {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

  const handleJoin = () => {
    const url = getJoinUrl(bot.place_id, bot.job_id);
    window.open(url, "_blank");
  };

  const getSongDisplay = () => {
    if (!bot.current_song) return null;
    return bot.current_song;
  };

  const songDisplay = getSongDisplay();

  return (
    <>
      <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]">
        {/* Top row: Avatar + Info + Status */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={bot.avatar_url}
              alt={bot.display_name}
              className="w-12 h-12 rounded-lg bg-secondary object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                bot.online ? "status-online" : "status-offline"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{bot.display_name}</h3>
            <p className="text-xs text-muted-foreground truncate">{bot.game_name}</p>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              bot.online
                ? "bg-green-500/10 text-green-500"
                : "bg-secondary text-muted-foreground"
            }`}>
              {bot.online ? "Online" : "Offline"}
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-end gap-1">
              <Users className="w-3 h-3" />
              {bot.players}
            </p>
          </div>
        </div>

        {/* Now Playing with Album Art */}
        {songDisplay && (
          <div className="mt-4 py-3 px-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Album Art */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/50 shrink-0 group">
                {bot.current_song_album_art ? (
                  <img
                    src={bot.current_song_album_art}
                    alt="Album"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      bot.is_playing ? "group-hover:scale-110" : ""
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Disc3 className={`w-6 h-6 text-primary/60 ${bot.is_playing ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
                  </div>
                )}
                {/* Playing overlay */}
                {bot.is_playing && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite]" style={{ height: '50%' }} />
                      <span className="w-1 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                      <span className="w-1 bg-white rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.2s]" style={{ height: '40%' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Song Info */}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                  <Music2 className={`w-3 h-3 ${bot.is_playing ? "text-primary" : ""}`} />
                  {bot.is_playing ? "Now Playing" : "Paused"}
                </p>
                <p className="text-sm font-semibold truncate">{songDisplay}</p>
                {bot.current_song_artist && (
                  <p className="text-xs text-muted-foreground truncate">{bot.current_song_artist}</p>
                )}
              </div>

              {/* Music Bars */}
              {bot.is_playing && (
                <div className="flex items-end gap-0.5 h-4 shrink-0">
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite]" style={{ height: '40%' }} />
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                  <span className="w-1 bg-primary rounded-full animate-[musicBar_0.5s_ease-in-out_infinite_0.2s]" style={{ height: '60%' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offline info */}
        {!bot.online && (
          <p className="mt-3 text-xs text-muted-foreground">
            Last seen {formatLastSeen(bot.last_seen)}
          </p>
        )}

        {/* Server full warning */}
        {bot.online && bot.is_full && (
          <p className="mt-3 text-xs text-warning flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            Server full — may take time to join
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {/* Control Panel Button */}
          <button
            onClick={() => setIsControlPanelOpen(true)}
            disabled={!bot.online}
            className="flex-1 h-10 rounded-lg font-semibold text-sm bg-secondary hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            <Settings2 className="w-4 h-4" />
            Control
          </button>

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={!bot.online}
            className="flex-1 h-10 rounded-lg font-semibold text-sm text-white btn-join disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-95"
          >
            {bot.online ? (
              <>
                Join
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            ) : (
              "Unavailable"
            )}
          </button>
        </div>
      </div>

      {/* Control Panel Modal */}
      <ControlPanelModal
        bot={bot}
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
      />
    </>
  );
}
