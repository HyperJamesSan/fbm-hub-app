import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Hub from "./pages/Hub.tsx";
import Session1 from "./pages/Session1.tsx";
import Session2 from "./pages/Session2.tsx";
import Knowledge from "./pages/Knowledge.tsx";
import Ideas from "./pages/Ideas.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/session-1" element={<Session1 />} />
          <Route path="/session-2" element={<Session2 />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/ideas" element={<Ideas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
