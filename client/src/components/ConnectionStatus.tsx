import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  connected: boolean;
  deviceName?: string;
}

export function ConnectionStatus({ connected, deviceName }: ConnectionStatusProps) {
  return (
    <Badge
      variant={connected ? "default" : "secondary"}
      className={`${
        connected ? "bg-green-500 text-white animate-pulse" : ""
      }`}
    >
      {connected ? (
        <>
          <Wifi className="w-3 h-3 mr-1" />
          {deviceName || "Connected"}
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 mr-1" />
          Disconnected
        </>
      )}
    </Badge>
  );
}
