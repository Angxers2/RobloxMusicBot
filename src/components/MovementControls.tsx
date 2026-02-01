import { useState, useEffect, useRef, useCallback } from "react";
import { sendWebCommand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

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

  // Send movement state when keys change
  const sendMovement = useCallback(async () => {
    const currentKeys = keysRef.current;
    if (Object.values(currentKeys).some((v) => v)) {
      await sendWebCommand(botId, username, "move", undefined, currentKeys);
    }
  }, [botId, username]);

  // Periodic movement updates while keys are pressed
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      sendMovement();
    }, 100); // 10 times per second

    return () => clearInterval(interval);
  }, [isActive, sendMovement]);

  // Keyboard event handlers
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

  // Reset keys when deactivated
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

  if (!isActive) {
    return (
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium">Movement Controls</h4>
              <p className="text-xs text-muted-foreground">Privileged Only</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsActive(true)}
          >
            Enable
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <div>
            <h4 className="text-sm font-medium">Movement Active</h4>
            <p className="text-xs text-muted-foreground">Use WASD or buttons</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsActive(false)}
        >
          Disable
        </Button>
      </div>

      {/* WASD Grid */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant={keys.w ? "default" : "outline"}
          size="sm"
          className="w-12 h-12 font-bold"
          onMouseDown={() => handleMouseDown("w")}
          onMouseUp={() => handleMouseUp("w")}
          onMouseLeave={() => handleMouseUp("w")}
        >
          W
        </Button>
        <div className="flex gap-1">
          <Button
            variant={keys.a ? "default" : "outline"}
            size="sm"
            className="w-12 h-12 font-bold"
            onMouseDown={() => handleMouseDown("a")}
            onMouseUp={() => handleMouseUp("a")}
            onMouseLeave={() => handleMouseUp("a")}
          >
            A
          </Button>
          <Button
            variant={keys.s ? "default" : "outline"}
            size="sm"
            className="w-12 h-12 font-bold"
            onMouseDown={() => handleMouseDown("s")}
            onMouseUp={() => handleMouseUp("s")}
            onMouseLeave={() => handleMouseUp("s")}
          >
            S
          </Button>
          <Button
            variant={keys.d ? "default" : "outline"}
            size="sm"
            className="w-12 h-12 font-bold"
            onMouseDown={() => handleMouseDown("d")}
            onMouseUp={() => handleMouseUp("d")}
            onMouseLeave={() => handleMouseUp("d")}
          >
            D
          </Button>
        </div>
        <Button
          variant={keys.space ? "default" : "outline"}
          size="sm"
          className="w-full max-w-[156px] h-10 mt-1"
          onMouseDown={() => handleMouseDown("space")}
          onMouseUp={() => handleMouseUp("space")}
          onMouseLeave={() => handleMouseUp("space")}
        >
          Jump
        </Button>
      </div>
    </div>
  );
}
