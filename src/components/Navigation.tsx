import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  MapPin,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const citizenLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/my-reports", icon: FileText, label: "My Reports" },
    { to: "/explore", icon: MapPin, label: "Explore" },
  ];

  const authorityLinks = [
    { to: "/authority", icon: Home, label: "Dashboard" },
    { to: "/authority/assignments", icon: FileText, label: "Assignments" },
  ];

  const adminLinks = [
    { to: "/admin", icon: BarChart3, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/zones", icon: MapPin, label: "Zones" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const getLinks = () => {
    if (profile?.role === "admin") return adminLinks;
    if (profile?.role === "authority") return authorityLinks;
    return citizenLinks;
  };

  const links = getLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Smart Incident</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive(link.to) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
              {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
