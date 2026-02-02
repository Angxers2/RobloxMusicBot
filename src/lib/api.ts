const API_URL = "https://api.robloxbot.cc";
const API_KEY = "43eebd9c57dc482c920e97c872c75dd1db4824dc5f5a4d17";

export interface Bot {
  bot_id: string;
  bot_username: string;
  display_name: string;
  game_name: string;
  server_region: string;
  players: string;
  players_current: number;
  players_max: number;
  is_full: boolean;
  current_song: string | null;
  current_song_artist?: string | null;
  current_song_album_art?: string | null;
  is_playing: boolean;
  online: boolean;
  join_url: string;
  place_id: string;
  job_id: string;
  avatar_url: string;
  last_seen: number;
}

export interface BotsListResponse {
  success: boolean;
  bots: Bot[];
  total: number;
  online_count: number;
}

export async function fetchBots(): Promise<BotsListResponse> {
  const response = await fetch(`${API_URL}/api/bots/list`, {
    headers: {
      "X-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bots: ${response.status}`);
  }

  return response.json();
}

export function getJoinUrl(place_id: string, job_id: string): string {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return `https://www.roblox.com/games/start?placeId=${place_id}&launchData=${job_id}`;
  } else {
    return `roblox://experiences/start?placeId=${place_id}&gameInstanceId=${job_id}`;
  }
}

export function formatLastSeen(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Control Panel API Types
export interface VerifyUserResponse {
  success: boolean;
  message?: string;
  in_server: boolean;
  is_privileged?: boolean;
  is_operator?: boolean;
  username?: string;
}

export interface NowPlayingResponse {
  success: boolean;
  playing: boolean;
  is_playing?: boolean;
  song_name?: string;
  artist_name?: string;
  album_name?: string;
  album_art_url?: string;
  current_position?: number;
  duration?: number;
  volume?: number;
  queue_size?: number;
  message?: string;
}

export interface QueueItem {
  position: number;
  song: string;
  artist: string;
  username: string;
  resolved_name?: string;
  resolved_artist?: string;
  search_status?: string;
}

export interface QueueResponse {
  success: boolean;
  queue: QueueItem[];
  total: number;
}

export interface CommandResponse {
  success: boolean;
  message: string;
}

// Verify if a user is in the same server as the bot
export async function verifyUser(botId: string, username: string): Promise<VerifyUserResponse> {
  const response = await fetch(`${API_URL}/api/bots/${botId}/verify-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({ username }),
  });

  return response.json();
}

// Send a command to the bot from the web panel
export async function sendWebCommand(
  botId: string,
  username: string,
  command: string,
  args?: string,
  keys?: Record<string, boolean>
): Promise<CommandResponse> {
  const response = await fetch(`${API_URL}/api/bots/${botId}/web-command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({ username, command, args, keys }),
  });

  return response.json();
}

// Get current song info
export async function fetchNowPlaying(): Promise<NowPlayingResponse> {
  const response = await fetch(`${API_URL}/now-playing`);
  return response.json();
}

// Get queue list
export async function fetchQueue(): Promise<QueueResponse> {
  const response = await fetch(`${API_URL}/queue`);
  return response.json();
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
