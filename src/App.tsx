import React from "react";
import Home from "./pages/Home";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 text-slate-900 antialiased dark:bg-zinc-950 dark:text-zinc-50 selection:bg-primary/20">
        {/* Core application component with embedded responsive architecture layout structure */}
        <Home />
        <Toaster position="top-right" closeButton richColors />
      </div>
    </SidebarProvider>
  );
}
