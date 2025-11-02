import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Clock, FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: incident, isLoading } = useQuery({
    queryKey: ["incident", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: photos = [] } = useQuery({
    queryKey: ["incident-photos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_photos")
        .select("*")
        .eq("incident_id", id!)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: statusLog = [] } = useQuery({
    queryKey: ["status-log", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incident_status_log")
        .select("*")
        .eq("incident_id", id!)
        .order("changed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("incident_id", id!)
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Incident not found</h2>
              <p className="text-muted-foreground mb-6">
                This incident doesn't exist or you don't have permission to view it.
              </p>
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOwner = incident.reporter_id === user?.id;
  const slaProgress = incident.sla_due 
    ? Math.min(100, Math.max(0, ((new Date().getTime() - new Date(incident.created_at!).getTime()) / (new Date(incident.sla_due).getTime() - new Date(incident.created_at!).getTime())) * 100))
    : 0;
  const isOverdue = incident.sla_due && new Date() > new Date(incident.sla_due);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="mb-6">
          <Link to={isOwner ? "/my-reports" : "/dashboard"}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      #{incident.id.slice(0, 8)}
                    </Badge>
                    {!incident.is_public && (
                      <Badge variant="secondary">Private</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl mb-2">{incident.title}</CardTitle>
                  <CardDescription className="text-base">
                    Reported on {new Date(incident.created_at!).toLocaleDateString()} at{" "}
                    {new Date(incident.created_at!).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={incident.priority} />
                  <StatusBadge status={incident.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{incident.description}</p>
              </div>

              {incident.location_text && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">{incident.location_text}</p>
                    {incident.location_lat && incident.location_lon && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Coordinates: {incident.location_lat.toFixed(6)}, {incident.location_lon.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {incident.sla_due && (
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">SLA Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Due: {new Date(incident.sla_due).toLocaleDateString()} at{" "}
                          {new Date(incident.sla_due).toLocaleTimeString()}
                        </span>
                        <span className={isOverdue ? "text-destructive font-semibold" : "text-muted-foreground"}>
                          {isOverdue ? "OVERDUE" : `${Math.round(slaProgress)}%`}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOverdue ? "bg-destructive" : slaProgress > 75 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${Math.min(100, slaProgress)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos ({photos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <PhotoDisplay key={photo.id} bucketPath={photo.bucket_path} fileName={photo.file_name} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments */}
          {assignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Authority Unit #{assignment.authority_unit_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Assigned {new Date(assignment.assigned_at!).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={assignment.accepted ? "default" : "secondary"}>
                        {assignment.accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              {statusLog.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No status changes yet</p>
              ) : (
                <div className="space-y-4">
                  {statusLog.map((log, index) => (
                    <div key={log.id}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 h-3 w-3 rounded-full bg-primary flex-shrink-0" />
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">
                              Status changed to{" "}
                              <StatusBadge status={log.new_status} />
                            </p>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.changed_at!).toLocaleDateString()}
                            </span>
                          </div>
                          {log.note && (
                            <p className="text-sm text-muted-foreground">{log.note}</p>
                          )}
                        </div>
                      </div>
                      {index < statusLog.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function PhotoDisplay({ bucketPath, fileName }: { bucketPath: string; fileName: string | null }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const getUrl = async () => {
      const { data } = await supabase.storage
        .from("incident-photos")
        .createSignedUrl(bucketPath, 3600);
      if (data?.signedUrl) setUrl(data.signedUrl);
    };
    getUrl();
  }, [bucketPath]);

  if (!url) return <div className="h-48 bg-muted animate-pulse rounded-lg" />;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img
        src={url}
        alt={fileName || "Incident photo"}
        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-smooth cursor-pointer"
      />
    </a>
  );
}
