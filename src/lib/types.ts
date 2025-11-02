import { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Incident = Database["public"]["Tables"]["incidents"]["Row"];
export type IncidentPhoto = Database["public"]["Tables"]["incident_photos"]["Row"];
export type IncidentStatusLog = Database["public"]["Tables"]["incident_status_log"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type Response = Database["public"]["Tables"]["responses"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Zone = Database["public"]["Tables"]["zones"]["Row"];
export type AuthorityUnit = Database["public"]["Tables"]["authority_units"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export type IncidentStatus = Database["public"]["Enums"]["incident_status"];
export type IncidentPriority = Database["public"]["Enums"]["incident_priority"];

export type UserRole = "citizen" | "authority" | "admin";
