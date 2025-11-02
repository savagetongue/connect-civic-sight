import { Badge } from "@/components/ui/badge";
import { IncidentPriority } from "@/lib/types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface PriorityBadgeProps {
  priority: IncidentPriority;
}

const priorityConfig: Record<IncidentPriority, { label: string; icon: typeof Info }> = {
  low: { label: "Low", icon: Info },
  medium: { label: "Medium", icon: AlertCircle },
  high: { label: "High", icon: AlertTriangle },
  critical: { label: "Critical", icon: AlertTriangle },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  
  return (
    <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold" 
         style={{ backgroundColor: `hsl(var(--priority-${priority}) / 0.15)`, color: `hsl(var(--priority-${priority}))`, border: `1px solid hsl(var(--priority-${priority}) / 0.3)` }}>
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
}
