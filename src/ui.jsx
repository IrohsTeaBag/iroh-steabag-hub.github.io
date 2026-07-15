import React from "react";
import { Clock, ShieldCheck } from "lucide-react";
import { C, RADIUS } from "./data";

export function StatusPill({ status }) {
  const cfg = {
    RESOLVED: { color: C.green, icon: ShieldCheck },
    "IN PROGRESS": { color: C.amber, icon: Clock },
    COMPLETE: { color: C.green, icon: ShieldCheck },
    PLANNED: { color: C.faint, icon: Clock },
  }[status] || { color: C.dim, icon: Clock };
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
      style={{ color: cfg.color, border: `1px solid ${cfg.color}44`, borderRadius: RADIUS }}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

export function PriorityDot({ priority }) {
  const color = { Critical: C.red, High: C.amber, Medium: C.blue, Low: C.faint }[priority] || C.dim;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {priority}
    </span>
  );
}

export function SectionEyebrow({ n, children, right }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="font-mono text-[11px] px-2 py-0.5"
        style={{ color: C.green, border: `1px solid ${C.green}33`, borderRadius: RADIUS }}
      >
        {n}
      </span>
      <h2 className="text-xl font-bold tracking-tight" style={{ color: C.text }}>{children}</h2>
      <div className="flex-1 h-px" style={{ background: C.border }} />
      {right}
    </div>
  );
}

export function Btn({ children, variant = "outline", className = "", disabled = false, ...rest }) {
  const styles = {
    primary: { background: C.green, color: "#04140B", border: `1px solid ${C.green}` },
    outline: { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    ghost: { background: "transparent", color: C.dim, border: "1px solid transparent" },
    danger: { background: "transparent", color: C.red, border: `1px solid ${C.red}44` },
  };
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap ${className}`}
      style={{ borderRadius: RADIUS, opacity: disabled ? 0.45 : 1, cursor: disabled ? "default" : "pointer", ...styles[variant] }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Panel({ title, right, children, className = "", padded = true }) {
  return (
    <div className={className} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
      {title && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2.5"
          style={{ borderBottom: `1px solid ${C.border}`, background: C.panelAlt }}
        >
          <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: C.dim }}>{title}</span>
          {right}
        </div>
      )}
      <div className={padded ? "p-4" : ""}>{children}</div>
    </div>
  );
}
