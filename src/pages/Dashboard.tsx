import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AlertCircle, FileText, MapPin, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Incident } from "@/lib/types";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const { data: myIncidents = [], isLoading } = useQuery({
    queryKey: ["my-incidents", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("reporter_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Incident[];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["incident-stats", user?.id],
    queryFn: async () => {
      const { count: total } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("reporter_id", user!.id);

      const { count: resolved } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("reporter_id", user!.id)
        .in("status", ["resolved", "closed"]);

      const { count: inProgress } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("reporter_id", user!.id)
        .in("status", ["assigned", "in_progress", "triaged"]);

      return { total: total || 0, resolved: resolved || 0, inProgress: inProgress || 0 };
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl gradient-hero p-8 text-primary-foreground shadow-glow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || "there"}!
              </h1>
              <p className="text-primary-foreground/90">
                Help improve your community by reporting issues
              </p>
            </div>
            <Link to="/submit-report">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                Report an Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                  <p className="text-3xl font-bold">{stats?.total || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                  <p className="text-3xl font-bold">{stats?.inProgress || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                  <p className="text-3xl font-bold">{stats?.resolved || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest submitted incidents</CardDescription>
              </div>
              <Link to="/my-reports">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : myIncidents.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't reported any issues yet</p>
                <Link to="/submit-report">
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Report
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myIncidents.map((incident) => (
                  <Link key={incident.id} to={`/incident/${incident.id}`}>
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold truncate">{incident.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <PriorityBadge priority={incident.priority} />
                            <StatusBadge status={incident.status} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>#{incident.id.slice(0, 8)}</span>
                          {incident.location_text && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {incident.location_text}
                            </span>
                          )}
                          <span>{new Date(incident.created_at!).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
