import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          variant: "default" as const,
          icon: CheckCircle2,
          label: "Completed",
          className: "bg-green-500 text-white hover:bg-green-600",
        };
      case "in_progress":
      case "active":
        return {
          variant: "default" as const,
          icon: Clock,
          label: "In Progress",
          className: "bg-blue-500 text-white hover:bg-blue-600",
        };
      case "assigned":
        return {
          variant: "secondary" as const,
          icon: Circle,
          label: "Assigned",
          className: "",
        };
      case "abandoned":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Abandoned",
          className: "",
        };
      default:
        return {
          variant: "outline" as const,
          icon: Circle,
          label: status,
          className: "",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
