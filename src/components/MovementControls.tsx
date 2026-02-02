import { useState, useEffect, useRef, useCallback } from "react";
import { sendWebCommand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Gamepad2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpFromLine } from "lucide-react";

interface MovementControlsProps {
  botId: string;
  username: string;
}

type Keys = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
};

export function MovementControls({ botId, username }: MovementControlsProps) {
  const [keys, setKeys] = useState<Keys>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });
  const [isActive, setIsActive] = useState(false);
  const keysRef = useRef(keys);
  keysRef.current = keys;

  const sendMovement = useCallback(async () => {
    const currentKeys = keysRef.current;
    if (Object.values(currentKeys).some((v) => v)) {
      await sendWebCommand(botId, username, "move", undefined, currentKeys);
    }
  }, [botId, username]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      sendMovement();
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, sendMovement]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d", " "].includes(key)) {
        e.preventDefault();
        setKeys((prev) => ({
          ...prev,
          [key === " " ? "space" : key]: true,
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d", " "].includes(key)) {
        setKeys((prev) => ({
          ...prev,
          [key === " " ? "space" : key]: false,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setKeys({ w: false, a: false, s: false, d: false, space: false });
    }
  }, [isActive]);

  const handleMouseDown = (key: keyof Keys) => {
    setKeys((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseUp = (key: keyof Keys) => {
    setKeys((prev) => ({ ...prev, [key]: false }));
  };

  const DirectionButton = ({
    direction,
    keyName,
    icon: Icon,
    className = "",
  }: {
    direction: string;
    keyName: keyof Keys;
    icon: React.ElementType;
    className?: string;
  }) => (
    <button
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
        keys[keyName]
          ? "bg-primary text-white shadow-lg shadow-primary/40 scale-95"
          : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
      } ${className}`}
      onMouseDown={() => handleMouseDown(keyName)}
      onMouseUp={() => handleMouseUp(keyName)}
      onMouseLeave={() => handleMouseUp(keyName)}
      onTouchStart={(e) => {
        e.preventDefault();
        handleMouseDown(keyName);
      }}
      onTouchEnd={() => handleMouseUp(keyName)}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="glass-card rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
            <Gamepad2 className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Movement</h4>
            <p className="text-[10px] text-muted-foreground">
              {isActive ? "Use WASD or buttons" : "Privileged Only"}
            </p>
          </div>
        </div>
        <Button
          variant={isActive ? "destructive" : "outline"}
          size="sm"
          onClick={() => setIsActive(!isActive)}
          className={`h-8 ${!isActive && "hover:bg-primary hover:text-white hover:border-primary"}`}
        >
          {isActive ? "Disable" : "Enable"}
        </Button>
      </div>

      {/* Controls */}
      {isActive && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Direction Pad */}
          <div className="flex flex-col items-center gap-1">
            <DirectionButton direction="up" keyName="w" icon={ChevronUp} />
            <div className="flex gap-1">
              <DirectionButton direction="left" keyName="a" icon={ChevronLeft} />
              <DirectionButton direction="down" keyName="s" icon={ChevronDown} />
              <DirectionButton direction="right" keyName="d" icon={ChevronRight} />
            </div>
          </div>

          {/* Jump Button */}
          <button
            className={`w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 ${
              keys.space
                ? "bg-primary text-white shadow-lg shadow-primary/40 scale-[0.98]"
                : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            onMouseDown={() => handleMouseDown("space")}
            onMouseUp={() => handleMouseUp("space")}
            onMouseLeave={() => handleMouseUp("space")}
            onTouchStart={(e) => {
              e.preventDefault();
              handleMouseDown("space");
            }}
            onTouchEnd={() => handleMouseUp("space")}
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span className="text-sm font-medium">Jump</span>
          </button>

          {/* Keyboard hint */}
          <p className="text-[10px] text-center text-muted-foreground/60">
            Press WASD + Space on keyboard for controls
          </p>
        </div>
      )}
    </div>
  );
}
