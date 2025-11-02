import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Shield, BarChart3, CheckCircle, AlertCircle, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl gradient-hero shadow-glow mb-6">
            <MapPin className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Smart Incident Reporting
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Empower your community with transparent, efficient incident reporting and response tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="hero" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
            <p className="text-muted-foreground">
              Quickly report incidents with photos, location, and detailed descriptions. Track progress in real-time.
            </p>
          </div>

          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Authority Response</h3>
            <p className="text-muted-foreground">
              Authorities receive assignments, manage workflows, and provide transparent updates to citizens.
            </p>
          </div>

          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-info" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-muted-foreground">
              Track SLA compliance, response times, and community trends with comprehensive analytics.
            </p>
          </div>

          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
            <p className="text-muted-foreground">
              View incidents on an interactive map, organized by zones for efficient assignment and response.
            </p>
          </div>

          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">SLA Management</h3>
            <p className="text-muted-foreground">
              Automatic SLA calculation based on priority levels ensures timely response and resolution.
            </p>
          </div>

          <div className="gradient-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-smooth">
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Secure, role-based system for citizens, authorities, and administrators with appropriate permissions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl gradient-hero p-12 text-center text-primary-foreground shadow-glow">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to improve your community?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of citizens making a difference
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="shadow-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Smart Incident. Built for better communities.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
