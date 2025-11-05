import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async (): Promise<UserRole | null> => {
      if (!user) return null;

      // Use raw SQL query since user_roles table isn't in generated types yet
      const { data, error } = await supabase.rpc("get_user_roles" as any, {
        _user_id: user.id,
      }) as { data: UserRole[] | null; error: any };

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return (data && data.length > 0 ? data[0] : null);
    },
    enabled: !!user,
  });
}
