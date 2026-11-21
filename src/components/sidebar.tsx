"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpenText,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Cloud,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Settings,
  TerminalSquare,
  X,
} from "lucide-react";
import { signOut } from "@/app/actions";

const groups = [
  {
    label: "Workspace",
    links: [
      { href: "/dashboard", name: "Overview", icon: LayoutDashboard },
      { href: "/projects", name: "Projects", icon: Boxes },
      { href: "/notes", name: "Notes", icon: BookOpenText },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/tools/network", name: "Networking", icon: Network },
      { href: "/tools/cloud", name: "Cloud", icon: Cloud },
      { href: "/tools/dev", name: "Development", icon: TerminalSquare },
    ],
  },
  { label: "", links: [{ href: "/settings", name: "Settings", icon: Settings }] },
];

type SidebarProps = {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
};

function Navigation({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link href="/dashboard" className={`brand${collapsed ? " is-compact" : ""}`} onClick={onNavigate}>
        <span className="brand-mark" aria-hidden="true"><FlaskConical size={18} strokeWidth={1.8} /></span>
        <span className="brand-name">Personal Lab</span>
      </Link>

      <nav className="side-nav" aria-label="Workspace">
        {groups.map((group) => (
          <div className="nav-group" key={group.label || "settings"}>
            {group.label && <h2 className={`nav-group-label${collapsed ? " sr-only" : ""}`}>{group.label}</h2>}
            {group.links.map(({ href, name, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? name : undefined}
                  title={collapsed ? name : undefined}
                  className={`nav-link${active ? " is-active" : ""}${collapsed ? " is-collapsed" : ""}`}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span className="nav-link-label">{name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <form action={signOut}>
          <button className={`signout-button${collapsed ? " is-collapsed" : ""}`}>
            <LogOut size={16} aria-hidden="true" />
            <span className="nav-link-label">Sign out</span>
          </button>
        </form>
      </div>
    </>
  );
}

export function Sidebar({ collapsed, onCollapseChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const wasMobileOpen = useRef(false);

  useEffect(() => {
    if (!mobileOpen) {
      if (wasMobileOpen.current) triggerRef.current?.focus();
      wasMobileOpen.current = false;
      return;
    }
    wasMobileOpen.current = true;

    const dialog = dialogRef.current;
    const firstControl = dialog?.querySelector<HTMLElement>("button, a[href]");
    firstControl?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <aside className={`desktop-sidebar${collapsed ? " is-collapsed" : ""}`}>
        <Navigation collapsed={collapsed} />
        <button
          type="button"
          className="collapse-button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={() => onCollapseChange(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </aside>

      <header className="mobile-header">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          className="mobile-menu-button"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <Link href="/dashboard" className="mobile-brand">
          <span className="brand-mark" aria-hidden="true"><FlaskConical size={17} /></span>
          Personal Lab
        </Link>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-layer">
          <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside
            ref={dialogRef}
            className="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
          >
            <div className="mobile-sidebar-top">
              <Navigation collapsed={false} onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                className="close-menu-button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
