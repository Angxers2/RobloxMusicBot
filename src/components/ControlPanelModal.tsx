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
import { Shield, User, LogOut, Wifi } from "lucide-react";

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
    // Reset state when closing
    setUsername(null);
    setIsPrivileged(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative">
              <img
                src={bot.avatar_url}
                alt={bot.display_name}
                className="w-10 h-10 rounded-lg bg-secondary"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1">
              <span className="block">{bot.display_name}</span>
              <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                {bot.game_name}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!username ? (
          <UsernameForm botId={bot.bot_id} onVerified={handleVerified} />
        ) : (
          <div className="space-y-4">
            {/* User Badge + Logout */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2">
                {isPrivileged ? (
                  <Badge variant="default" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Privileged
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <User className="w-3 h-3" />
                    Member
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-1" />
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
