import { useState, useEffect } from "react";
import { verifyUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Clock } from "lucide-react";

const STORAGE_KEY = "roblox_cached_usernames";
const MAX_CACHED = 5;

interface UsernameFormProps {
  botId: string;
  onVerified: (username: string, isPrivileged: boolean) => void;
}

function getCachedUsernames(): string[] {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

function saveCachedUsername(username: string) {
  try {
    const cached = getCachedUsernames();
    const filtered = cached.filter((u) => u.toLowerCase() !== username.toLowerCase());
    const updated = [username, ...filtered].slice(0, MAX_CACHED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

function removeCachedUsername(username: string) {
  try {
    const cached = getCachedUsernames();
    const updated = cached.filter((u) => u.toLowerCase() !== username.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function UsernameForm({ botId, onVerified }: UsernameFormProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cachedUsernames, setCachedUsernames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const cached = getCachedUsernames();
    setCachedUsernames(cached);
    if (cached.length > 0) {
      setUsername(cached[0]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyUser(botId, username.trim());

      if (response.success && response.in_server) {
        saveCachedUsername(username.trim());
        onVerified(username.trim(), response.is_privileged || false);
      } else {
        setError("Not in server. Join the same game as the bot or try a different username.");
      }
    } catch {
      setError("Failed to verify. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCached = (cached: string) => {
    setUsername(cached);
    setShowSuggestions(false);
    setError("");
  };

  const handleRemoveCached = (e: React.MouseEvent, cached: string) => {
    e.stopPropagation();
    removeCachedUsername(cached);
    setCachedUsernames((prev) => prev.filter((u) => u !== cached));
    if (username === cached) {
      setUsername("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Enter Your Username</h3>
        <p className="text-sm text-muted-foreground">
          To use the control panel, you must be in the same Roblox server as the bot.
        </p>
      </div>

      <div className="relative">
        <Input
          placeholder="Your Roblox username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onFocus={() => cachedUsernames.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          disabled={isLoading}
          autoFocus
        />

        {showSuggestions && cachedUsernames.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
            <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-1 border-b border-border">
              <Clock className="w-3 h-3" />
              Recent usernames
            </div>
            {cachedUsernames.map((cached) => (
              <div
                key={cached}
                className="flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer group"
                onClick={() => handleSelectCached(cached)}
              >
                <span className="text-sm">{cached}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveCached(e, cached)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 text-center p-3 bg-red-400/10 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !username.trim()}
      >
        {isLoading ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}
