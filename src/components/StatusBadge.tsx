import { Badge } from "@/components/ui/badge";
import { IncidentStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: IncidentStatus;
}

const statusLabels: Record<IncidentStatus, string> = {
  submitted: "Submitted",
  triaged: "Triaged",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  rejected: "Rejected",
  escalated: "Escalated",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = `status-${status}` as const;
  
  return (
    <Badge variant={variant}>
      {statusLabels[status]}
    </Badge>
  );
}
