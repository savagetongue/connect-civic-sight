import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { IncidentStatus } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function MyReports() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["my-incidents", user?.id, statusFilter],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("incidents")
        .select("*, categories(name), zones(name)")
        .eq("reporter_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const statusCounts = {
    all: incidents?.length || 0,
    submitted: incidents?.filter(i => i.status === "submitted").length || 0,
    assigned: incidents?.filter(i => i.status === "assigned").length || 0,
    in_progress: incidents?.filter(i => i.status === "in_progress").length || 0,
    resolved: incidents?.filter(i => i.status === "resolved").length || 0,
    closed: incidents?.filter(i => i.status === "closed").length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container pt-24 pb-16 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Reports</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your incident reports
            </p>
          </div>
          <Button asChild>
            <Link to="/submit-report">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Link>
          </Button>
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-2">{statusCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted <Badge variant="secondary" className="ml-2">{statusCounts.submitted}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress <Badge variant="secondary" className="ml-2">{statusCounts.in_progress}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved <Badge variant="secondary" className="ml-2">{statusCounts.resolved}</Badge>
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed <Badge variant="secondary" className="ml-2">{statusCounts.closed}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : incidents && incidents.length > 0 ? (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Link key={incident.id} to={`/incident/${incident.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{incident.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {incident.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge status={incident.status} />
                        <PriorityBadge priority={incident.priority} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {incident.categories && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{incident.categories.name}</Badge>
                        </div>
                      )}
                      {incident.zones && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{incident.zones.name}</Badge>
                        </div>
                      )}
                      {incident.location_text && (
                        <span>📍 {incident.location_text}</span>
                      )}
                      <span>
                        Created {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {statusFilter === "all" 
                  ? "You haven't submitted any reports yet"
                  : `No reports with status "${statusFilter}"`}
              </p>
              {statusFilter === "all" && (
                <Button asChild>
                  <Link to="/submit-report">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Report
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
