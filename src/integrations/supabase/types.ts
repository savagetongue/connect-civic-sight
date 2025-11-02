export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          assigned_at: string | null
          assigned_by: string | null
          authority_unit_id: number | null
          deadline: string | null
          id: number
          incident_id: string | null
          notes: string | null
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          authority_unit_id?: number | null
          deadline?: string | null
          id?: number
          incident_id?: string | null
          notes?: string | null
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          authority_unit_id?: number | null
          deadline?: string | null
          id?: number
          incident_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_authority_unit_id_fkey"
            columns: ["authority_unit_id"]
            isOneToOne: false
            referencedRelation: "authority_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity: string
          entity_id: string
          id: number
          payload: Json | null
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity: string
          entity_id: string
          id?: number
          payload?: Json | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string
          entity_id?: string
          id?: number
          payload?: Json | null
          performed_by?: string | null
        }
        Relationships: []
      }
      authority_units: {
        Row: {
          active: boolean | null
          id: number
          meta: Json | null
          name: string | null
          profile_id: string | null
          zone_id: number | null
        }
        Insert: {
          active?: boolean | null
          id?: number
          meta?: Json | null
          name?: string | null
          profile_id?: string | null
          zone_id?: number | null
        }
        Update: {
          active?: boolean | null
          id?: number
          meta?: Json | null
          name?: string | null
          profile_id?: string | null
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "authority_units_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_units_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      business_calendar: {
        Row: {
          date: string
          is_workday: boolean | null
          note: string | null
        }
        Insert: {
          date: string
          is_workday?: boolean | null
          note?: string | null
        }
        Update: {
          date?: string
          is_workday?: boolean | null
          note?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          commenter_id: string | null
          created_at: string | null
          id: number
          incident_id: string | null
          is_anonymous: boolean | null
          message: string
        }
        Insert: {
          commenter_id?: string | null
          created_at?: string | null
          id?: number
          incident_id?: string | null
          is_anonymous?: boolean | null
          message: string
        }
        Update: {
          commenter_id?: string | null
          created_at?: string | null
          id?: number
          incident_id?: string | null
          is_anonymous?: boolean | null
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_commenter_id_fkey"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_photos: {
        Row: {
          bucket_path: string
          file_name: string | null
          file_size: number | null
          id: string
          incident_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket_path: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          incident_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket_path?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          incident_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_photos_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_status_log: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: number
          incident_id: string | null
          new_status: Database["public"]["Enums"]["incident_status"] | null
          note: string | null
          old_status: Database["public"]["Enums"]["incident_status"] | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          incident_id?: string | null
          new_status?: Database["public"]["Enums"]["incident_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["incident_status"] | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          incident_id?: string | null
          new_status?: Database["public"]["Enums"]["incident_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["incident_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_status_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_status_log_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          archived: boolean | null
          category_id: number | null
          created_at: string | null
          description: string
          duplicate_of: string | null
          id: string
          is_public: boolean | null
          location_lat: number | null
          location_lon: number | null
          location_text: string | null
          priority: Database["public"]["Enums"]["incident_priority"]
          reporter_id: string | null
          resolved_at: string | null
          sla_due: string | null
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string | null
          upvotes: number | null
          zone_id: number | null
        }
        Insert: {
          archived?: boolean | null
          category_id?: number | null
          created_at?: string | null
          description: string
          duplicate_of?: string | null
          id?: string
          is_public?: boolean | null
          location_lat?: number | null
          location_lon?: number | null
          location_text?: string | null
          priority?: Database["public"]["Enums"]["incident_priority"]
          reporter_id?: string | null
          resolved_at?: string | null
          sla_due?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string | null
          upvotes?: number | null
          zone_id?: number | null
        }
        Update: {
          archived?: boolean | null
          category_id?: number | null
          created_at?: string | null
          description?: string
          duplicate_of?: string | null
          id?: string
          is_public?: boolean | null
          location_lat?: number | null
          location_lon?: number | null
          location_text?: string | null
          priority?: Database["public"]["Enums"]["incident_priority"]
          reporter_id?: string | null
          resolved_at?: string | null
          sla_due?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          authority_unit_id: number | null
          created_at: string | null
          id: number
          incident_id: string | null
          media_paths: string[] | null
          message: string
          responder_id: string | null
        }
        Insert: {
          authority_unit_id?: number | null
          created_at?: string | null
          id?: number
          incident_id?: string | null
          media_paths?: string[] | null
          message: string
          responder_id?: string | null
        }
        Update: {
          authority_unit_id?: number | null
          created_at?: string | null
          id?: number
          incident_id?: string | null
          media_paths?: string[] | null
          message?: string
          responder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_authority_unit_id_fkey"
            columns: ["authority_unit_id"]
            isOneToOne: false
            referencedRelation: "authority_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          center_lat: number | null
          center_lon: number | null
          id: number
          meta: Json | null
          name: string
        }
        Insert: {
          center_lat?: number | null
          center_lon?: number | null
          id?: number
          meta?: Json | null
          name: string
        }
        Update: {
          center_lat?: number | null
          center_lon?: number | null
          id?: number
          meta?: Json | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_assign_authority: {
        Args: { p_incident_id: string }
        Returns: undefined
      }
    }
    Enums: {
      incident_priority: "low" | "medium" | "high" | "critical"
      incident_status:
        | "submitted"
        | "triaged"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "closed"
        | "rejected"
        | "escalated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      incident_priority: ["low", "medium", "high", "critical"],
      incident_status: [
        "submitted",
        "triaged",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected",
        "escalated",
      ],
    },
  },
} as const
