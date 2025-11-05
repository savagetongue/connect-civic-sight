import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuthorityResponseProps {
  incidentId: string;
}

export function AuthorityResponse({ incidentId }: AuthorityResponseProps) {
  const { user } = useAuth();
  const { data: role } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [message, setMessage] = useState("");

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

  const { data: responses, isLoading } = useQuery({
    queryKey: ["responses", incidentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("responses")
        .select(`
          *,
          authority_units (
            name
          ),
          profiles:responder_id (
            full_name,
            email
          )
        `)
        .eq("incident_id", incidentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addResponseMutation = useMutation({
    mutationFn: async () => {
      if (!user || !authorityUnit) throw new Error("Not authorized");

      const { error } = await supabase.from("responses").insert({
        incident_id: incidentId,
        authority_unit_id: authorityUnit.id,
        responder_id: user.id,
        message,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses", incidentId] });
      setMessage("");
      toast({
        title: "Response posted",
        description: "Your official response has been posted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post response",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addResponseMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Official Authority Responses ({responses?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && role === "authority" && authorityUnit && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Post an official response..."
              rows={3}
              required
            />
            <Button type="submit" disabled={addResponseMutation.isPending}>
              {addResponseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Shield className="mr-2 h-4 w-4" />
              Post Official Response
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : responses && responses.length > 0 ? (
            responses.map((response) => (
              <div key={response.id} className="flex gap-3 border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Shield className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default">
                      {response.authority_units?.name || "Authority"}
                    </Badge>
                    <span className="font-medium text-sm">
                      {response.profiles?.full_name || response.profiles?.email || "Official"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(response.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{response.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No official responses yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
