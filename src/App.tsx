import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports";
import IncidentDetail from "./pages/IncidentDetail";
import Explore from "./pages/Explore";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create QueryClient inside component to avoid React instance issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/submit-report" element={<RequireAuth><SubmitReport /></RequireAuth>} />
              <Route path="/my-reports" element={<RequireAuth><MyReports /></RequireAuth>} />
              <Route path="/incident/:id" element={<RequireAuth><IncidentDetail /></RequireAuth>} />
              <Route path="/explore" element={<RequireAuth><Explore /></RequireAuth>} />
              <Route path="/authority" element={<RequireAuth><AuthorityDashboard /></RequireAuth>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
