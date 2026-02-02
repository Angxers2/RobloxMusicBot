import { useState } from "react";
import { Bot } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UsernameForm } from "./UsernameForm";
import { NowPlaying } from "./NowPlaying";
import { MusicControls } from "./MusicControls";
import { QueueView } from "./QueueView";
import { SongRequest } from "./SongRequest";
import { MovementControls } from "./MovementControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut, Wifi, Users, Music2 } from "lucide-react";

interface ControlPanelModalProps {
  bot: Bot;
  isOpen: boolean;
  onClose: () => void;
}

export function ControlPanelModal({ bot, isOpen, onClose }: ControlPanelModalProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isPrivileged, setIsPrivileged] = useState(false);

  const handleVerified = (verifiedUsername: string, privileged: boolean) => {
    setUsername(verifiedUsername);
    setIsPrivileged(privileged);
  };

  const handleLogout = () => {
    setUsername(null);
    setIsPrivileged(false);
  };

  const handleClose = () => {
    setUsername(null);
    setIsPrivileged(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="p-5 pb-4 border-b border-border/50 shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <img
                src={bot.avatar_url}
                alt={bot.display_name}
                className="w-12 h-12 rounded-xl bg-secondary shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background shadow-lg shadow-green-500/50" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-lg">{bot.display_name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wifi className="w-3 h-3" />
                <span className="truncate">{bot.game_name}</span>
                <span className="text-muted-foreground/50">|</span>
                <Users className="w-3 h-3" />
                <span>{bot.players}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!username ? (
            <UsernameForm botId={bot.bot_id} onVerified={handleVerified} />
          ) : (
            <>
              {/* User Badge + Logout */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-secondary/60 to-secondary/30 border border-border/50">
                <div className="flex items-center gap-2">
                  {isPrivileged ? (
                    <Badge className="gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">
                      <Shield className="w-3 h-3" />
                      Privileged
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <User className="w-3 h-3" />
                      Member
                    </Badge>
                  )}
                  <span className="text-sm font-medium">{username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground h-8"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Switch
                </Button>
              </div>

              {/* Now Playing */}
              <NowPlaying />

              {/* Music Controls (Privileged Only) */}
              {isPrivileged && (
                <MusicControls botId={bot.bot_id} username={username} />
              )}

              {/* Queue */}
              <QueueView />

              {/* Song Request (All Users) */}
              <SongRequest botId={bot.bot_id} username={username} />

              {/* Movement Controls (Privileged Only) */}
              {isPrivileged && (
                <MovementControls botId={bot.bot_id} username={username} />
              )}

              {/* Footer info for non-privileged */}
              {!isPrivileged && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground/90">Want more controls?</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact the bot operator to request privileged access for playback controls, volume adjustment, and movement features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
