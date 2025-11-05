import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, MapPin, TrendingUp, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { formatDistanceToNow } from "date-fns";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: incidents, isLoading } = useQuery({
    queryKey: ["public-incidents", searchQuery, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("incidents")
        .select("*, categories(name), zones(name), profiles!incidents_reporter_id_fkey(full_name)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category_id", parseInt(categoryFilter));
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: commentsCount } = useQuery({
    queryKey: ["comments-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("incident_id");
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(comment => {
        counts[comment.incident_id] = (counts[comment.incident_id] || 0) + 1;
      });
      return counts;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container pt-24 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Public Incidents</h1>
          <p className="text-muted-foreground">
            Browse and search public incident reports in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents by title or description..."
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setCategoryFilter("all");
            setStatusFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>

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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{incident.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {incident.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <StatusBadge status={incident.status} />
                        <PriorityBadge priority={incident.priority} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center">
                      {incident.categories && (
                        <Badge variant="outline">{incident.categories.name}</Badge>
                      )}
                      {incident.zones && (
                        <Badge variant="outline">{incident.zones.name}</Badge>
                      )}
                      {incident.location_text && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{incident.location_text}</span>
                        </div>
                      )}
                      {incident.upvotes > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{incident.upvotes} upvotes</span>
                        </div>
                      )}
                      {commentsCount && commentsCount[incident.id] > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{commentsCount[incident.id]} comments</span>
                        </div>
                      )}
                      <span className="ml-auto">
                        {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
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
              <p className="text-muted-foreground">
                No public incidents found matching your criteria
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
