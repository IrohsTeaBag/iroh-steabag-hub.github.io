import React, { useState, useMemo } from "react";
import { Search, Bell, ChevronRight, ChevronLeft, Shield, X, Menu } from "lucide-react";
import { C, RADIUS, NAV_ITEMS } from "../data";
import { useProjects, useSkillGroups, useCertificates } from "../hooks";
import OwnerToggle from "./OwnerToggle";
import ProfilePhoto from "./ProfilePhoto";

export function Sidebar({ active, setActive, collapsed, setCollapsed, onClose }) {
  return (
    <div
      className="h-full flex flex-col shrink-0 transition-all duration-200"
      style={{ width: collapsed ? 68 : 224, background: "#0D0E11", borderRight: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
        <div className="h-8 w-8 flex items-center justify-center shrink-0" style={{ background: C.green, borderRadius: RADIUS }}>
          <Shield size={16} color="#04140B" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[12px] font-bold tracking-wide truncate" style={{ color: C.text }}>TUMISO.NGWAKO</div>
            <div className="text-[10px] font-mono truncate" style={{ color: C.faint }}>SEC_CONSOLE v3.0</div>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="p-1.5 shrink-0 md:hidden" style={{ color: C.dim, borderRadius: RADIUS }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="px-4 pt-3 pb-1">
        {!collapsed && <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.faint }}>Navigation</span>}
      </div>

      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); if (onClose) onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium relative"
              style={{ color: isActive ? C.text : C.dim, background: isActive ? C.raised : "transparent", borderRadius: RADIUS }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.panelAlt; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && <span className="absolute left-0 top-1 bottom-1 w-[2px]" style={{ background: C.green }} />}
              <Icon size={16} style={{ color: isActive ? C.green : C.faint }} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!onClose && (
        <div className="p-3" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-mono"
            style={{ color: C.faint, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}
          >
            {collapsed ? <ChevronRight size={13} /> : <><ChevronLeft size={13} /> COLLAPSE</>}
          </button>
        </div>
      )}
    </div>
  );
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2"
        style={{ color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}
      >
        <Bell size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 p-3 z-40"
          style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS, boxShadow: "0 12px 32px rgba(0,0,0,.5)" }}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: C.faint }}>Notifications</div>
          <div className="text-xs" style={{ color: C.dim }}>No new notifications.</div>
        </div>
      )}
    </div>
  );
}

export function Topbar({ query, setQuery, onNavigate, ownerMode, setOwnerMode, onMenuClick }) {
  const [focused, setFocused] = useState(false);
  const [projects] = useProjects();
  const [skillGroups] = useSkillGroups();
  const [certs] = useCertificates();
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchable = [
      ...projects.map((p) => ({ type: "Project", label: p.title, view: "projects" })),
      ...skillGroups.flatMap((g) => g.skills.map((s) => ({ type: "Skill", label: s.name, view: "skills" }))),
      ...certs.map((c) => ({ type: "Certificate", label: c.name, view: "certificates" })),
    ];
    return searchable.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  }, [query, projects, skillGroups, certs]);

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 shrink-0 relative" style={{ height: 58, background: "#0D0E11", borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={onMenuClick}
        className="p-2 shrink-0 md:hidden"
        style={{ color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}
        title="Open menu"
      >
        <Menu size={16} />
      </button>
      <div className="relative flex-1 min-w-0 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.faint }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="search index=..."
          className="w-full min-w-0 pl-9 pr-3 py-2 text-xs font-mono outline-none"
          style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}
        />
        {focused && results.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 overflow-hidden z-30" style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS, boxShadow: "0 12px 32px rgba(0,0,0,.5)" }}>
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => { onNavigate(r.view); setQuery(""); }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs"
                style={{ borderBottom: i !== results.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span style={{ color: C.text }}>{r.label}</span>
                <span className="font-mono text-[10px]" style={{ color: C.green }}>{r.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-2 font-mono text-[10px]" style={{ color: C.faint }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.green }} />
        SYSTEM NOMINAL
      </div>

      <NotificationsBell />

      <OwnerToggle ownerMode={ownerMode} setOwnerMode={setOwnerMode} />

      <ProfilePhoto size={32} ownerMode={false} />
    </div>
  );
}
