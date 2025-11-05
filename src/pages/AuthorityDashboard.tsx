import { useAuth } from "@/lib/auth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { formatDistanceToNow } from "date-fns";

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const { data: role } = useUserRole();

  const { data: authorityUnit } = useQuery({
    queryKey: ["authority-unit", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("authority_units")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && role === "authority",
  });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["authority-assignments", authorityUnit?.id],
    queryFn: async () => {
      if (!authorityUnit) return [];
      const { data, error } = await supabase
        .from("assignments")
        .select(`
          *,
          incidents (
            id,
            title,
            description,
            status,
            priority,
            location_text,
            created_at,
            sla_due
          )
        `)
        .eq("authority_unit_id", authorityUnit.id)
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!authorityUnit,
  });

  const stats = {
    total: assignments?.length || 0,
    pending: assignments?.filter(a => !a.accepted).length || 0,
    inProgress: assignments?.filter(a => a.accepted && a.incidents?.status === "in_progress").length || 0,
    overdue: assignments?.filter(a => {
      const incident = a.incidents as any;
      return incident?.sla_due && new Date(incident.sla_due) < new Date() && incident.status !== "resolved";
    }).length || 0,
  };

  if (role !== "authority") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container pt-24 pb-16 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You need authority role to access this page
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authority Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assigned incidents and respond to citizen reports
          </p>
          {authorityUnit && (
            <Badge variant="default" className="mt-2">
              {authorityUnit.name}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Acceptance</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : assignments && assignments.length > 0 ? (
          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const incident = assignment.incidents as any;
              if (!incident) return null;
              
              const isOverdue = incident.sla_due && new Date(incident.sla_due) < new Date() && incident.status !== "resolved";

              return (
                <Link key={assignment.id} to={`/incident/${incident.id}`}>
                  <Card className={`hover:border-primary transition-colors cursor-pointer ${isOverdue ? 'border-destructive' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{incident.title}</CardTitle>
                            {isOverdue && (
                              <Badge variant="destructive">OVERDUE</Badge>
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">
                            {incident.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <StatusBadge status={incident.status} />
                          <PriorityBadge priority={incident.priority} />
                          {!assignment.accepted && (
                            <Badge variant="warning">Pending</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {incident.location_text && (
                          <span>📍 {incident.location_text}</span>
                        )}
                        <span>
                          Assigned {formatDistanceToNow(new Date(assignment.assigned_at), { addSuffix: true })}
                        </span>
                        {incident.sla_due && (
                          <span className={isOverdue ? "text-destructive font-semibold" : ""}>
                            Due: {new Date(incident.sla_due).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No assignments yet. You'll be notified when incidents are assigned to your unit.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
