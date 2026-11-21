"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />
      <main id="main-content" className={`app-main${collapsed ? " is-collapsed" : ""}`}>
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}
