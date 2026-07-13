import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, FolderGit2, Award, FileText, User as UserIcon, Wrench,
  Briefcase, Mail, Search, Bell, ChevronRight, ChevronLeft, Github, Linkedin,
  ExternalLink, Download, Shield, Activity, Lock, Eye,
  CheckCircle2, Clock, X, Cpu, Server, Zap, MapPin, GraduationCap, Send,
  ShieldAlert, ShieldCheck, PlayCircle, Trash2, Plus, Unlock, Upload, Menu
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RRadar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell
} from "recharts";

/* ============================== DESIGN TOKENS (Splunk-style flat enterprise) ============================== */
const C = {
  bg: "#0B0C0E",
  panel: "#131519",
  panelAlt: "#191C21",
  raised: "#1E2127",
  border: "#262A31",
  borderSoft: "#1B1E24",
  text: "#E7EBEF",
  dim: "#8B93A0",
  faint: "#565C66",
  green: "#3ED598",
  cyan: "#3FC6E0",
  blue: "#5B8DEF",
  purple: "#9B7FE0",
  amber: "#E8A93B",
  red: "#E1596A",
};
const RADIUS = 3;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // headroom under the 5MB per-key storage limit

/* ============================== DATA ============================== */
const PROFILE = {
  name: "Tumiso K. Ngwako",
  title: "Cybersecurity Intern · Web AppSec & SOC",
  summary:
    "Cybersecurity intern specializing in web application security, threat detection, and OT/ICS security. Final-year Computer Systems Engineering student at TUT, currently completing Work-Integrated Learning across web AppSec, SOC operations, and industrial control system security.",
  location: "Gauteng, South Africa",
  status: "Open to internships",
  education: "Comp. Systems Eng., TUT",
  focus: "Web AppSec + SOC",
  secondaryFocus: "OT / ICS Security",
};

const ABOUT_PARAGRAPHS = [
  "Final-year Computer Systems Engineering student at Tshwane University of Technology, currently completing Work-Integrated Learning as a Cybersecurity Intern. My focus is web application security and SOC operations: I use Burp Suite and OWASP Top 10 methodology to assess vulnerabilities like SQLi, XSS, and API security issues, and I work with Wazuh and Microsoft Sentinel for threat detection.",
  "I also have growing experience in OT/ICS security, working with Siemens S7-1200 PLCs and SCADA protocols. That side of my work draws on a solid engineering background, including hands-on electronics and embedded systems projects using PIC and ESP32 microcontrollers, Arduino, and PLC ladder logic, so I understand both the IT and industrial sides of the systems I'm securing.",
  "I'm comfortable working across C++, C#, Python, and Assembly, and I'm building toward a career in blue team work.",
];

const PROFICIENCY = [
  { label: "Web AppSec", sub: "Primary focus", value: 75, color: C.green },
  { label: "SOC / SIEM", sub: "Threat detection", value: 88, color: C.blue },
  { label: "OT / ICS", sub: "Secondary skills", value: 65, color: C.dim },
];

const SKILL_GROUPS = [
  {
    group: "Web / Application / SOC Security",
    tag: "Primary",
    color: C.green,
    skills: [
      { name: "Burp Suite", detail: "SQLi, XSS, CSRF, LFI", level: 80 },
      { name: "Nmap & Recon", detail: "Network enumeration", level: 78 },
      { name: "Kali Linux", detail: "Offensive tooling", level: 82 },
      { name: "Wazuh / Sentinel", detail: "EDR tools", level: 85 },
      { name: "Azure Cloud", detail: "Cloud security ops", level: 70 },
      { name: "VMware", detail: "Lab virtualization", level: 88 },
    ],
  },
  {
    group: "OT / ICS Security",
    tag: "Secondary",
    color: C.blue,
    skills: [
      { name: "Siemens S7-1200", detail: "PLC exploitation", level: 62 },
      { name: "python-snap7", detail: "S7comm scripting", level: 60 },
      { name: "SCADA Architecture", detail: "Purdue model", level: 65 },
      { name: "Wireshark (ICS)", detail: "Protocol analysis", level: 68 },
      { name: "ICS Exploitation", detail: "Industrial attack paths", level: 58 },
      { name: "Network Segmentation", detail: "IT/OT boundary design", level: 66 },
    ],
  },
  {
    group: "Programming",
    tag: "Foundation",
    color: C.dim,
    skills: [
      { name: "Python", detail: "Tooling & automation", level: 80 },
      { name: "C++", detail: "Embedded & systems", level: 68 },
      { name: "C#", detail: "Applications", level: 60 },
      { name: "Assembly", detail: "Low-level / firmware", level: 55 },
    ],
  },
];

const PROJECTS = [
  {
    id: "mwr-webapp",
    title: "MWR CyberSec Internship: Web App Penetration Testing",
    date: "2026-05",
    priority: "High",
    status: "RESOLVED",
    category: "Web Application Security",
    difficulty: "Intermediate",
    description:
      "Structured web application penetration testing internship covering OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, and more) using Burp Suite in a VMware-lab environment.",
    tags: ["Burp Suite", "SQLi", "XSS", "API Security", "VMware"],
    overview:
      "A structured internship engagement targeting a lab web application, working through OWASP Top 10 vulnerability classes end-to-end: discovery, exploitation, and reporting.",
    objectives: [
      "Map the application's attack surface and authentication flows",
      "Identify and validate SQLi, XSS, and CSRF vulnerabilities",
      "Assess API endpoints for broken access control and input validation issues",
      "Document findings to a professional reporting standard",
    ],
    tech: ["Burp Suite", "OWASP Top 10", "VMware", "Kali Linux"],
    metrics: [
      { label: "Vulnerability classes tested", value: "OWASP Top 10" },
      { label: "Primary tool", value: "Burp Suite" },
      { label: "Environment", value: "VMware lab" },
    ],
  },
  {
    id: "azure-honeypot",
    title: "Azure Cloud Honeypot + Sentinel",
    date: "2026-04",
    priority: "High",
    status: "RESOLVED",
    category: "SOC / Cloud Security",
    difficulty: "Intermediate",
    description:
      "Deployed an Azure-based honeypot to capture and analyze real-world attack traffic, integrated with Microsoft Sentinel for SIEM correlation and EDR tooling.",
    tags: ["Azure", "Sentinel", "EDR", "SIEM", "VMware"],
    overview:
      "A cloud-hosted honeypot designed to attract and log live internet attack traffic, feeding into Microsoft Sentinel for correlation, alerting, and analysis.",
    objectives: [
      "Deploy and expose a honeypot instance on Azure",
      "Forward captured telemetry into Microsoft Sentinel",
      "Build correlation rules to surface real attacker behavior",
      "Analyze captured traffic for common attack patterns",
    ],
    tech: ["Microsoft Azure", "Microsoft Sentinel", "EDR", "SIEM"],
    metrics: [
      { label: "Platform", value: "Microsoft Azure" },
      { label: "SIEM", value: "Sentinel" },
      { label: "Focus", value: "Live attack telemetry" },
    ],
  },
  {
    id: "wazuh-homelab",
    title: "SOC Automation Homelab: Wazuh",
    date: "2026-03",
    priority: "Medium",
    status: "RESOLVED",
    category: "SOC Operations",
    difficulty: "Intermediate",
    description:
      "Developed a home-based SOC lab leveraging Wazuh for real-time Windows endpoint monitoring, log aggregation, and automated alerting within a virtualized environment.",
    tags: ["Wazuh", "SIEM", "Windows", "VMware"],
    overview:
      "A self-built SOC homelab centered on Wazuh, monitoring Windows endpoints in a virtualized environment to practice detection engineering and alert triage.",
    objectives: [
      "Deploy Wazuh manager and agents across a virtual lab",
      "Aggregate and normalize Windows endpoint logs",
      "Configure automated alerting for suspicious activity",
      "Practice triage workflows on generated alerts",
    ],
    tech: ["Wazuh", "Windows", "VMware"],
    metrics: [
      { label: "Monitoring target", value: "Windows endpoints" },
      { label: "Platform", value: "Wazuh" },
      { label: "Environment", value: "Virtualized homelab" },
    ],
  },
  {
    id: "plc-exploitation",
    title: "OT Security: PLC Exploitation Lab",
    date: "2026 — ongoing",
    priority: "Critical",
    status: "IN PROGRESS",
    category: "OT / ICS Security",
    difficulty: "Advanced",
    secondary: true,
    description:
      "Home lab built around a Siemens S7-1200 (CPU 1211C). Custom scripts and Kali Linux tooling used to identify and exploit vulnerabilities in industrial control communications.",
    tags: ["Siemens S7-1200", "Kali", "python-snap7", "VMware"],
    overview:
      "A hands-on OT security lab built around a physical Siemens S7-1200 PLC, exploring the intersection of IT offensive tooling and industrial control protocols.",
    objectives: [
      "Set up and instrument a Siemens S7-1200 (CPU 1211C) test bed",
      "Interact with S7comm using python-snap7",
      "Identify weaknesses in industrial control communications",
      "Document exploitation paths and segmentation recommendations",
    ],
    tech: ["Siemens S7-1200", "python-snap7", "Kali Linux", "VMware"],
    metrics: [
      { label: "Target PLC", value: "Siemens S7-1200" },
      { label: "Scripting", value: "python-snap7" },
      { label: "Status", value: "Ongoing" },
    ],
  },
];

const CERT_SEED = [
  { name: "MWR CyberSec Virtual Internship Certificate", desc: "Web application penetration testing methodology.", status: "COMPLETE", issued: "2026" },
  { name: "EC-Council SOC Analyst (CSA) Short Course", desc: "Foundational training in SOC procedures, threat monitoring, and incident response.", status: "COMPLETE", issued: "2026" },
  { name: "Sigma White Belt Certification", desc: "Introduction to Sigma rules and detection engineering principles.", status: "COMPLETE", issued: "2026" },
  { name: "Microsoft Azure Fundamentals (AZ-900)", desc: "Core Azure cloud concepts and security fundamentals.", status: "PLANNED", issued: null },
  { name: "SC-900 · Security, Compliance & Identity", desc: "Next on the list.", status: "PLANNED", issued: null },
  { name: "CompTIA Security+", desc: "Vendor-neutral security foundation.", status: "PLANNED", issued: null },
];

const TRAINING = [
  { name: "Blue Teaming Path (Modules 1, 2 & 3)", desc: "Defensive security, threat hunting, and incident response.", status: "COMPLETE", issued: "2026" },
  { name: "SOC Analyst Training (Tier 1, 2 & 3)", desc: "Alert triage, investigation, and escalation procedures.", status: "COMPLETE", issued: "2026" },
  { name: "MWR CyberSec: Firefly CTF", desc: "TryHackMe capstone challenge covering web exploitation.", status: "COMPLETE", issued: "2026" },
];

const TIMELINE = [
  { kind: "Employment", when: "CURRENT", title: "Cybersecurity Intern — Work Integrated Learning (WIL)", desc: "Hands-on exposure to OT/ICS security on a multi-year SCADA modernisation project for critical infrastructure." },
  { kind: "Education", when: "2022 – 2026", title: "Computer Systems Engineering", desc: "Tshwane University of Technology (TUT) — with a growing focus on cybersecurity and industrial control systems." },
];

const RADAR_DATA = [
  { subject: "Web AppSec", value: 75 },
  { subject: "SOC/SIEM", value: 88 },
  { subject: "OT/ICS", value: 65 },
  { subject: "Recon", value: 78 },
  { subject: "Scripting", value: 76 },
  { subject: "Cloud", value: 70 },
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "experience", label: "Experience", icon: GraduationCap },
  { id: "about", label: "About", icon: UserIcon },
  { id: "resume", label: "CV", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

const SEARCHABLE = [
  ...PROJECTS.map((p) => ({ type: "Project", label: p.title, view: "projects" })),
  ...CERT_SEED.map((c) => ({ type: "Certificate", label: c.name, view: "certificates" })),
  ...SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ type: "Skill", label: s.name, view: "skills" }))),
];

/* Owner-only passcode gate. Client-side only — good enough to keep casual
   visitors from editing content, not a substitute for real authentication. */
const OWNER_PASSCODE = "ngwako-owner";

/* ============================== HELPERS ============================== */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Persists a single JSON-serializable value under `key` in shared storage. */
function useStoredJSON(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await window.storage.get(key, true);
        if (!cancelled) setValue(res ? JSON.parse(res.value) : fallback);
      } catch {
        if (!cancelled) setValue(fallback);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = async (next) => {
    setValue(next);
    try {
      await window.storage.set(key, JSON.stringify(next), true);
    } catch {
      /* optimistic UI already reflects the change */
    }
  };

  return [value, persist, loading];
}

/* ============================== PRIMITIVES ============================== */
function StatusPill({ status }) {
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

function PriorityDot({ priority }) {
  const color = { Critical: C.red, High: C.amber, Medium: C.blue, Low: C.faint }[priority] || C.dim;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {priority}
    </span>
  );
}

function SectionEyebrow({ n, children, right }) {
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

/** Flat Splunk-style button. Variants: primary | outline | ghost | danger */
function Btn({ children, variant = "outline", className = "", disabled = false, ...rest }) {
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

/** Splunk-style dashboard panel: title strip + body. */
function Panel({ title, right, children, className = "", padded = true }) {
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

/* ============================== PROFILE PHOTO (owner-uploadable) ============================== */
function ProfilePhoto({ size = 96, ownerMode }) {
  const [photo, setPhoto] = useStoredJSON("profile-photo", null).slice(0, 2);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That image is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setPhoto({ dataUrl });
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: RADIUS }}
      >
        {photo?.dataUrl ? (
          <img src={photo.dataUrl} alt={PROFILE.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono font-bold" style={{ color: C.dim, fontSize: size * 0.28 }}>TN</span>
        )}
      </div>
      {ownerMode && (
        <button
          onClick={() => inputRef.current?.click()}
          title="Change profile photo"
          className="absolute -bottom-2 -right-2 p-1.5"
          style={{ background: C.green, borderRadius: RADIUS }}
        >
          <Upload size={12} color="#04140B" />
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}

/* ============================== OWNER MODE TOGGLE ============================== */
function OwnerToggle({ ownerMode, setOwnerMode }) {
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);

  function attempt() {
    const normalized = pass.trim().toLowerCase();
    if (normalized.length > 0 && normalized === OWNER_PASSCODE.toLowerCase()) {
      setOwnerMode(true);
      setOpen(false);
      setPass("");
      setErr(false);
    } else {
      setErr(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      attempt();
    }
  }

  if (ownerMode) {
    return (
      <button
        onClick={() => setOwnerMode(false)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider shrink-0"
        style={{ color: C.green, border: `1px solid ${C.green}44`, borderRadius: RADIUS }}
      >
        <Unlock size={12} /> <span className="hidden sm:inline">Owner mode</span>
      </button>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2"
        style={{ color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}
        title="Owner sign-in"
      >
        <Lock size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 p-3 z-40"
          style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS, boxShadow: "0 12px 32px rgba(0,0,0,.5)" }}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: C.faint }}>Owner passcode</div>
          <div className="flex gap-2">
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={(e) => { setPass(e.target.value); setErr(false); }}
              onKeyDown={handleKeyDown}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              className="flex-1 min-w-0 px-2 py-1.5 text-xs outline-none"
              style={{ background: C.panelAlt, border: `1px solid ${err ? C.red : C.border}`, color: C.text, borderRadius: RADIUS }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="px-2 shrink-0"
              style={{ color: C.faint, border: `1px solid ${C.border}`, borderRadius: RADIUS }}
              title={show ? "Hide passcode" : "Show passcode"}
            >
              <Eye size={13} />
            </button>
            <button
              type="button"
              onClick={attempt}
              className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider shrink-0"
              style={{ background: C.green, color: "#04140B", border: `1px solid ${C.green}`, borderRadius: RADIUS }}
            >
              Go
            </button>
          </div>
          {err && <div className="text-[10px] mt-1.5" style={{ color: C.red }}>Incorrect passcode.</div>}
        </div>
      )}
    </div>
  );
}

/* ============================== SIDEBAR ============================== */
function Sidebar({ active, setActive, collapsed, setCollapsed, onClose }) {
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

/* ============================== NOTIFICATIONS ============================== */
function NotificationsBell() {
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

/* ============================== TOPBAR ============================== */
function Topbar({ query, setQuery, onNavigate, ownerMode, setOwnerMode, onMenuClick }) {
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return SEARCHABLE.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  }, [query]);

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

/* ============================== PROJECT VIDEOS (owner-uploadable) ============================== */
function ProjectVideos({ project, ownerMode }) {
  const [videos, setVideos, loading] = useStoredJSON(`videos:${project.id}`, []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState("Subsystem");
  const [lightbox, setLightbox] = useState(null);

  function addVideo(e) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setVideos([...videos, { id: `${Date.now()}`, title: title.trim(), url: url.trim(), kind }]);
    setTitle(""); setUrl(""); setKind("Subsystem"); setShowForm(false);
  }
  function removeVideo(id) { setVideos(videos.filter((v) => v.id !== id)); }

  function embedUrl(raw) {
    try {
      const u = new URL(raw);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) return raw;
    } catch { /* not a URL */ }
    return null;
  }

  function youtubeId(raw) {
    try {
      const u = new URL(raw);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) return u.searchParams.get("v");
      if (u.hostname === "youtu.be") return u.pathname.replace("/", "");
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) return u.pathname.replace("/embed/", "");
    } catch { /* not a URL */ }
    return null;
  }
  function thumbUrl(raw) {
    const id = youtubeId(raw);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  return (
    <Panel title="Videos" right={ownerMode && (
      <Btn variant="ghost" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add video</Btn>
    )}>
      {ownerMode && showForm && (
        <form onSubmit={addVideo} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-3" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, e.g. Detection Rules" className="md:col-span-2 px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Video URL" className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>
            <option>Full Demo</option>
            <option>Subsystem</option>
          </select>
          <Btn variant="primary" type="submit" className="md:col-span-4 justify-center">Save video</Btn>
        </form>
      )}

      {loading ? (
        <div className="text-xs" style={{ color: C.faint }}>Loading videos…</div>
      ) : videos.length === 0 ? (
        <div className="text-xs" style={{ color: C.faint }}>No videos added for this project yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {videos.map((v) => (
            <div key={v.id} className="relative" style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, overflow: "hidden" }}>
              <button
                onClick={() => setLightbox(v)}
                className="w-full h-20 flex items-center justify-center relative"
                style={{
                  background: thumbUrl(v.url) ? `${C.panelAlt} url(${thumbUrl(v.url)}) center/cover no-repeat` : C.panelAlt,
                }}
              >
                {thumbUrl(v.url) && <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.35)" }} />}
                <PlayCircle size={20} style={{ color: C.green, position: "relative" }} />
              </button>
              <div className="px-2 py-1.5" style={{ background: C.panel }}>
                <div className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{v.title}</div>
                <div className="text-[10px]" style={{ color: C.faint }}>{v.kind}</div>
              </div>
              {ownerMode && (
                <button onClick={() => removeVideo(v.id)} className="absolute top-1.5 right-1.5 p-1" style={{ background: "rgba(0,0,0,.65)", borderRadius: RADIUS }} title="Delete video">
                  <Trash2 size={12} style={{ color: C.red }} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,.85)" }} onClick={() => setLightbox(null)}>
          <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm" style={{ color: "#fff" }}>{lightbox.title}</div>
              <button onClick={() => setLightbox(null)}><X size={18} color="#fff" /></button>
            </div>
            {embedUrl(lightbox.url) ? (
              <iframe src={embedUrl(lightbox.url)} className="w-full aspect-video" style={{ border: "none", borderRadius: RADIUS }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <a href={lightbox.url} target="_blank" rel="noreferrer" className="block text-center py-10 text-sm underline" style={{ color: C.blue }}>Open video link</a>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ============================== PROJECT REPORT (owner-uploadable) ============================== */
function ProjectReport({ project, ownerMode }) {
  const [report, setReport] = useStoredJSON(`report:${project.id}`, null);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setReport({ dataUrl, filename: file.name, uploadedAt: new Date().toLocaleDateString(), createdAt: Date.now() });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
      {report ? (
        <a href={report.dataUrl} download={report.filename}>
          <Btn variant="primary"><FileText size={12} /> Read Report</Btn>
        </a>
      ) : (
        <Btn variant="outline" disabled><FileText size={12} /> Report not yet available</Btn>
      )}
      {ownerMode && (
        <>
          <Btn variant="outline" onClick={() => inputRef.current?.click()}><Upload size={12} /> {report ? "Replace report" : "Upload report"}</Btn>
          {report && <Btn variant="danger" onClick={() => setReport(null)}><Trash2 size={12} /></Btn>}
        </>
      )}
    </div>
  );
}

/* ============================== PROJECT DETAIL ============================== */
/* ============================== PROJECT CODE LINK (owner-editable) ============================== */
function ProjectCodeLink({ project, ownerMode }) {
  const [code, setCode] = useStoredJSON(`code:${project.id}`, null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function startEdit() {
    setDraft(code?.url || "");
    setEditing(true);
  }
  function save(e) {
    e.preventDefault();
    const url = draft.trim();
    setCode(url ? { url } : null);
    setEditing(false);
  }

  if (ownerMode && editing) {
    return (
      <form onSubmit={save} className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://github.com/IrohsTeaBag/..."
          className="px-2 py-1.5 text-xs outline-none w-64"
          style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}
        />
        <Btn variant="primary" type="submit">Save</Btn>
        <Btn variant="ghost" type="button" onClick={() => setEditing(false)}>Cancel</Btn>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {code?.url ? (
        <a href={code.url} target="_blank" rel="noreferrer"><Btn variant="outline"><Github size={12} /> View Code</Btn></a>
      ) : (
        <Btn variant="outline" disabled><Github size={12} /> Code not yet linked</Btn>
      )}
      {ownerMode && <Btn variant="ghost" onClick={startEdit}><Upload size={12} /> {code?.url ? "Edit link" : "Add link"}</Btn>}
    </div>
  );
}

function ProjectDetail({ project, onClose, ownerMode }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(4,5,6,0.85)" }} onClick={onClose}>
      <div className="w-full max-w-3xl" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 p-6" style={{ borderBottom: `1px solid ${C.border}`, background: C.panelAlt }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>{project.category}</span>
              <PriorityDot priority={project.priority} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: C.text }}>{project.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 shrink-0" style={{ background: C.raised, borderRadius: RADIUS }}>
            <X size={16} style={{ color: C.text }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            {project.tags.map((t) => (
              <span key={t} className="text-[11px] font-mono px-2 py-1" style={{ background: C.panelAlt, color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>{t}</span>
            ))}
            <StatusPill status={project.status} />
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: C.green }}>Overview</div>
            <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{project.overview}</p>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: C.green }}>Objectives</div>
            <ul className="space-y-1.5">
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: C.text }}>
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: C.green }} /> {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {project.metrics.map((m, i) => (
              <div key={i} className="p-3 text-center" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
                <div className="text-xs font-bold" style={{ color: C.text }}>{m.value}</div>
                <div className="text-[10px] mt-1" style={{ color: C.faint }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: C.green }}>Technologies Used</div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1" style={{ border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>{t}</span>
              ))}
            </div>
          </div>

          <ProjectVideos project={project} ownerMode={ownerMode} />

          <div className="flex flex-wrap gap-2 items-center pt-2">
            <ProjectReport project={project} ownerMode={ownerMode} />
            <ProjectCodeLink project={project} ownerMode={ownerMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== PROJECTS ============================== */
function ProjectCard({ p, onOpen }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
      <button onClick={() => onOpen(p)} className="w-full text-left p-5 flex flex-col h-full">
        <div className="h-24 mb-4 flex items-center justify-center" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
          {p.secondary ? <Cpu size={26} style={{ color: C.blue }} /> : <Server size={26} style={{ color: C.green }} />}
        </div>
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>{p.category}</span>
          <div className="flex items-center gap-2 shrink-0">
            <PriorityDot priority={p.priority} />
            <span className="text-[10px] font-mono" style={{ color: C.faint }}>{p.date}</span>
          </div>
        </div>
        <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: C.text }}>{p.title}</h3>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: C.dim }}>{p.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5" style={{ background: C.panelAlt, color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-3" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
          <StatusPill status={p.status} />
          <span className="text-[11px] font-mono flex items-center gap-1 shrink-0" style={{ color: C.green }}>Open <ChevronRight size={12} /></span>
        </div>
      </button>
    </div>
  );
}

function ProjectsPage({ onOpen }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(PROJECTS.map((p) => p.category))];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="04">Projects</SectionEyebrow>
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="px-3 py-1.5 text-xs font-mono"
            style={{
              background: filter === c ? C.green : "transparent",
              color: filter === c ? "#04140B" : C.dim,
              border: `1px solid ${filter === c ? C.green : C.borderSoft}`,
              borderRadius: RADIUS,
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => <ProjectCard key={p.id} p={p} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

/* ============================== CERTIFICATES ============================== */
function CertCard({ c, ownerMode, onDelete, onAttach, onRemoveFile }) {
  const inputRef = useRef(null);
  const [lightbox, setLightbox] = useState(false);
  const hasFile = !!c.fileDataUrl;
  const isImage = hasFile && c.fileDataUrl.startsWith("data:image");

  return (
    <Panel title={c.status} right={ownerMode && onDelete && (
      <button onClick={onDelete} title="Delete certificate"><Trash2 size={13} style={{ color: C.red }} /></button>
    )}>
      {hasFile && isImage && (
        <button
          onClick={() => setLightbox(true)}
          className="w-full h-32 mb-3 overflow-hidden block"
          style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, background: C.panelAlt }}
          title="View certificate"
        >
          <img src={c.fileDataUrl} alt={c.name} className="w-full h-full object-cover" />
        </button>
      )}
      {hasFile && !isImage && (
        <button
          onClick={() => window.open(c.fileDataUrl, "_blank")}
          className="w-full h-16 mb-3 flex items-center justify-center gap-2"
          style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, background: C.panelAlt, color: C.dim }}
          title="View certificate"
        >
          <FileText size={16} /> <span className="text-xs">{c.fileName || "View document"}</span>
        </button>
      )}

      <h3 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: C.text }}>{c.name}</h3>
      <p className="text-xs leading-relaxed mb-3" style={{ color: C.dim }}>{c.desc}</p>
      {c.credentialId && <div className="text-[11px] mb-1" style={{ color: C.faint }}>ID: {c.credentialId}</div>}
      <div className="flex items-center justify-between pt-3 flex-wrap gap-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <span className="text-[10px] font-mono" style={{ color: C.faint }}>{c.issued ? `Issued ${c.issued}` : "Not yet issued"}</span>
        <div className="flex items-center gap-2">
          {c.verifyUrl && (
            <a href={c.verifyUrl} target="_blank" rel="noreferrer"><Btn variant="ghost"><ExternalLink size={11} /> Verify</Btn></a>
          )}
          {hasFile && (
            <>
              <Btn variant="ghost" onClick={() => (isImage ? setLightbox(true) : window.open(c.fileDataUrl, "_blank"))}><Eye size={11} /> View</Btn>
              <a href={c.fileDataUrl} download={c.fileName}><Btn variant="outline"><Download size={11} /> Download</Btn></a>
            </>
          )}
          {ownerMode && onAttach && (
            <>
              <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onAttach(f); }} />
              <Btn variant="ghost" onClick={() => inputRef.current?.click()}><Upload size={11} /> {hasFile ? "Replace" : "Attach"}</Btn>
              {hasFile && onRemoveFile && <Btn variant="danger" onClick={onRemoveFile}><Trash2 size={11} /></Btn>}
            </>
          )}
        </div>
      </div>

      {lightbox && isImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,.85)" }} onClick={() => setLightbox(false)}>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm" style={{ color: "#fff" }}>{c.name}</div>
              <button onClick={() => setLightbox(false)}><X size={18} color="#fff" /></button>
            </div>
            <img src={c.fileDataUrl} alt={c.name} className="w-full max-h-[80vh] object-contain" style={{ borderRadius: RADIUS }} />
          </div>
        </div>
      )}
    </Panel>
  );
}

function CertificatesPage({ ownerMode }) {
  const [certs, setCerts, loading] = useStoredJSON("certificates", null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });

  useEffect(() => {
    if (!loading && certs === null) {
      setCerts(CERT_SEED.map((c, i) => ({ id: `seed-${i}`, credentialId: "", verifyUrl: "", fileDataUrl: null, fileName: null, ...c })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, certs]);

  const list = certs || [];

  function addCert(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCerts([...list, { id: `${Date.now()}`, createdAt: Date.now(), fileDataUrl: null, fileName: null, ...form }]);
    setForm({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });
    setShowForm(false);
  }
  function removeCert(id) { setCerts(list.filter((c) => c.id !== id)); }
  async function attachFile(id, file) {
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setCerts(list.map((c) => (c.id === id ? { ...c, fileDataUrl: dataUrl, fileName: file.name } : c)));
  }
  function removeFile(id) {
    setCerts(list.map((c) => (c.id === id ? { ...c, fileDataUrl: null, fileName: null } : c)));
  }

  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10">
      <div>
        <SectionEyebrow n="06" right={ownerMode && <Btn variant="primary" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add certificate</Btn>}>
          Certifications
        </SectionEyebrow>

        {ownerMode && showForm && (
          <Panel title="New certificate" className="mb-6">
            <form onSubmit={addCert} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input required placeholder="Certificate name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
                <option>COMPLETE</option>
                <option>PLANNED</option>
              </select>
              <input placeholder="Issued (e.g. 2026)" value={form.issued} onChange={(e) => setForm((f) => ({ ...f, issued: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
              <input placeholder="Credential ID (optional)" value={form.credentialId} onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
              <input placeholder="Verification link (optional)" value={form.verifyUrl} onChange={(e) => setForm((f) => ({ ...f, verifyUrl: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
              <textarea placeholder="Short description" rows={2} value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
              <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save certificate</Btn>
            </form>
          </Panel>
        )}

        {loading ? (
          <div className="text-xs" style={{ color: C.faint }}>Loading certificates…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((c) => (
              <CertCard key={c.id} c={c} ownerMode={ownerMode} onDelete={() => removeCert(c.id)} onAttach={(f) => attachFile(c.id, f)} onRemoveFile={() => removeFile(c.id)} />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionEyebrow n="—">Training &amp; Self-Study</SectionEyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TRAINING.map((c, i) => <CertCard key={i} c={{ ...c, id: `t-${i}` }} ownerMode={false} />)}
        </div>
      </div>
    </div>
  );
}

/* ============================== RESUME / CV ============================== */
function CVManager({ ownerMode }) {
  const [cv, setCv, loading] = useStoredJSON("cv-document", null);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setCv({ dataUrl, filename: file.name, uploadedAt: new Date().toLocaleDateString(), createdAt: Date.now() });
  }

  return (
    <Panel title="Curriculum Vitae" right={ownerMode && (
      <div className="flex gap-2">
        <Btn variant="outline" onClick={() => inputRef.current?.click()}><Upload size={12} /> {cv ? "Replace" : "Upload"}</Btn>
        {cv && <Btn variant="danger" onClick={() => setCv(null)}><Trash2 size={12} /> Remove</Btn>}
      </div>
    )}>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
      {loading ? (
        <div className="text-xs" style={{ color: C.faint }}>Loading…</div>
      ) : cv ? (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm font-semibold" style={{ color: C.text }}>{cv.filename}</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.faint }}>Uploaded {cv.uploadedAt}</div>
          </div>
          <a href={cv.dataUrl} download={cv.filename}><Btn variant="primary"><Download size={12} /> Download CV</Btn></a>
        </div>
      ) : (
        <div className="text-xs" style={{ color: C.faint }}>{ownerMode ? "No CV uploaded yet — upload one above." : "CV not yet available."}</div>
      )}
    </Panel>
  );
}

function ResumePage({ ownerMode }) {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <SectionEyebrow n="—">CV</SectionEyebrow>

      <CVManager ownerMode={ownerMode} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Experience">
          {TIMELINE.filter((t) => t.kind === "Employment").map((t, i) => (
            <div key={i}>
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.green, border: `1px solid ${C.green}33`, borderRadius: RADIUS }}>{t.when}</span>
              <div className="text-sm font-bold mt-2" style={{ color: C.text }}>{t.title}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.dim }}>{t.desc}</p>
            </div>
          ))}
        </Panel>

        <Panel title="Education">
          {TIMELINE.filter((t) => t.kind === "Education").map((t, i) => (
            <div key={i}>
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.blue, border: `1px solid ${C.blue}33`, borderRadius: RADIUS }}>{t.when}</span>
              <div className="text-sm font-bold mt-2" style={{ color: C.text }}>{t.title}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.dim }}>{t.desc}</p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Skills Summary">
        <div className="flex flex-wrap gap-2">
          {SKILL_GROUPS.flatMap((g) => g.skills).map((s) => (
            <span key={s.name} className="text-xs px-3 py-1.5" style={{ border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>{s.name}</span>
          ))}
        </div>
      </Panel>

      <Panel title="Achievements">
        <ul className="space-y-2">
          {[...CERT_SEED, ...TRAINING].filter((c) => c.status === "COMPLETE").map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-sm" style={{ color: C.text }}>
              <ShieldCheck size={14} style={{ color: C.green }} /> {c.name}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="References">
        <p className="text-xs" style={{ color: C.faint }}>Available on request.</p>
      </Panel>
    </div>
  );
}

/* ============================== SKILLS ============================== */
function SkillsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10">
      <SectionEyebrow n="02">Skills</SectionEyebrow>
      {SKILL_GROUPS.map((g, gi) => (
        <div key={gi}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-bold" style={{ color: C.text }}>{g.group}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: g.color, border: `1px solid ${g.color}33`, borderRadius: RADIUS }}>{g.tag}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {g.skills.map((s) => (
              <div key={s.name} className="p-4" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold" style={{ color: C.text }}>{s.name}</span>
                  <span className="text-xs font-mono" style={{ color: g.color }}>{s.level}%</span>
                </div>
                <div className="text-[11px] mb-2" style={{ color: C.faint }}>{s.detail}</div>
                <div className="h-1.5 overflow-hidden" style={{ background: C.borderSoft, borderRadius: RADIUS }}>
                  <div className="h-full" style={{ width: `${s.level}%`, background: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Panel title="Proficiency Overview">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={PROFICIENCY}>
            <CartesianGrid stroke={C.borderSoft} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: C.faint, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fill: C.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {PROFICIENCY.map((p, i) => <Cell key={i} fill={p.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

/* ============================== EXPERIENCE / TIMELINE ============================== */
function ExperiencePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="05">Timeline</SectionEyebrow>
      <div className="relative pl-8">
        <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: C.border }} />
        {TIMELINE.map((t, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            <div className="absolute -left-8 top-1 h-3 w-3" style={{ background: t.kind === "Employment" ? C.green : C.blue, borderRadius: RADIUS }} />
            <Panel>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>{t.kind}</span>
                <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.green, border: `1px solid ${C.green}33`, borderRadius: RADIUS }}>{t.when}</span>
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: C.text }}>{t.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: C.dim }}>{t.desc}</p>
            </Panel>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== ABOUT ============================== */
function AboutPage({ ownerMode }) {
  const infoCards = [
    { label: "Focus", value: PROFILE.focus, icon: ShieldAlert },
    { label: "Secondary Focus", value: PROFILE.secondaryFocus, icon: Cpu },
    { label: "Education", value: PROFILE.education, icon: GraduationCap },
    { label: "Location", value: PROFILE.location, icon: MapPin },
    { label: "Status", value: PROFILE.status, icon: Zap },
  ];
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="01">About</SectionEyebrow>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: C.dim }}>{p}</p>
          ))}
        </div>
        <div className="space-y-3">
          <Panel>
            <div className="flex items-center gap-3">
              <ProfilePhoto size={56} ownerMode={ownerMode} />
              <div>
                <div className="text-sm font-bold" style={{ color: C.text }}>{PROFILE.name}</div>
                <div className="text-[11px]" style={{ color: C.faint }}>{PROFILE.title}</div>
              </div>
            </div>
          </Panel>
          {infoCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="p-4 flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
                <Icon size={16} style={{ color: C.green }} />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>{c.label}</div>
                  <div className="text-xs font-semibold" style={{ color: C.text }}>{c.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== CONTACT ============================== */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const links = [
    { label: "LinkedIn", icon: Linkedin, value: "linkedin.com/in/ngwakotumiso", href: "https://www.linkedin.com/in/ngwakotumiso" },
    { label: "GitHub", icon: Github, value: "github.com/IrohsTeaBag", href: "https://github.com/IrohsTeaBag" },
    { label: "Email", icon: Mail, value: "ngwakotumiso01@gmail.com", href: "mailto:ngwakotumiso01@gmail.com" },
    { label: "Location", icon: MapPin, value: PROFILE.location },
  ];
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="—">Contact</SectionEyebrow>
      <Panel className="mb-6">
        <h2 className="text-xl font-bold mb-2" style={{ color: C.text }}>Let's talk security.</h2>
        <p className="text-sm max-w-xl" style={{ color: C.dim }}>
          Open to cybersecurity internship and graduate opportunities, especially where IT and OT security intersect.
        </p>
      </Panel>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {links.map((l, i) => {
            const Icon = l.icon;
            const Wrapper = l.href ? "a" : "div";
            const wrapperProps = l.href ? { href: l.href, target: "_blank", rel: "noreferrer" } : {};
            return (
              <Wrapper key={i} {...wrapperProps} className="p-4 flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
                <div className="h-9 w-9 flex items-center justify-center" style={{ background: C.panelAlt, borderRadius: RADIUS }}>
                  <Icon size={15} style={{ color: C.green }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono uppercase" style={{ color: C.faint }}>{l.label}</div>
                  <div className="text-xs truncate" style={{ color: C.text }}>{l.value}</div>
                </div>
                {l.href && <ExternalLink size={13} className="shrink-0" style={{ color: C.faint }} />}
              </Wrapper>
            );
          })}
          <div className="p-4 flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
            <div className="h-9 w-9 flex items-center justify-center" style={{ background: C.panelAlt, borderRadius: RADIUS }}>
              <Clock size={15} style={{ color: C.green }} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase" style={{ color: C.faint }}>Calendar</div>
              <div className="text-xs" style={{ color: C.text }}>Booking link placeholder</div>
            </div>
          </div>
        </div>

        <Panel className="lg:col-span-2">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShieldCheck size={28} style={{ color: C.green }} />
              <div className="text-sm font-semibold mt-3" style={{ color: C.text }}>Message queued.</div>
              <div className="text-xs mt-1" style={{ color: C.faint }}>This is a demo form — wire it up to your email service to go live.</div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>Name</label>
                  <input required className="w-full mt-1 px-3 py-2 text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>Email</label>
                  <input required type="email" className="w-full mt-1 px-3 py-2 text-sm outline-none" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>Message</label>
                <textarea required rows={5} className="w-full mt-1 px-3 py-2 text-sm outline-none resize-none" style={inputStyle} />
              </div>
              <Btn variant="primary" type="submit"><Send size={13} /> Send Message</Btn>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
}

/** Builds a real last-6-months activity series from project start dates and
    genuine content-creation timestamps (certs, videos, reports, CV). No
    invented numbers — months with nothing real that happened show zero. */
function useActivitySeries() {
  const [buckets, setBuckets] = useState(null); // null = still loading

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = {};
      const bump = (ts) => {
        if (!ts) return;
        const d = new Date(ts);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[key] = (map[key] || 0) + 1;
      };

      // Real project start months, e.g. "2026-05"
      PROJECTS.forEach((p) => {
        const m = /^(\d{4})-(\d{2})$/.exec(p.date);
        if (m) bump(`${m[1]}-${m[2]}-01`);
      });

      // Certificates added through owner mode (only ones with a real createdAt)
      try {
        const res = await window.storage.get("certificates", true);
        const certs = res ? JSON.parse(res.value) : [];
        certs.forEach((c) => bump(c.createdAt));
      } catch { /* none yet */ }

      // Videos and reports attached per project
      for (const p of PROJECTS) {
        try {
          const vres = await window.storage.get(`videos:${p.id}`, true);
          const vids = vres ? JSON.parse(vres.value) : [];
          vids.forEach((v) => bump(Number(v.id)));
        } catch { /* none yet */ }
        try {
          const rres = await window.storage.get(`report:${p.id}`, true);
          const rep = rres ? JSON.parse(rres.value) : null;
          if (rep?.createdAt) bump(rep.createdAt);
        } catch { /* none yet */ }
      }

      // CV upload
      try {
        const cvres = await window.storage.get("cv-document", true);
        const cv = cvres ? JSON.parse(cvres.value) : null;
        if (cv?.createdAt) bump(cv.createdAt);
      } catch { /* none yet */ }

      if (cancelled) return;

      const now = new Date();
      const series = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        series.push({ m: MONTH_LABELS[d.getMonth()], a: map[key] || 0 });
      }
      setBuckets(series);
    })();
    return () => { cancelled = true; };
  }, []);

  return buckets;
}

/* ============================== DASHBOARD ============================== */
function Dashboard({ navigate, ownerMode }) {
  const activity = useActivitySeries();
  const projectsDone = PROJECTS.filter((p) => p.status === "RESOLVED").length;
  const cProj = useCountUp(PROJECTS.length);
  const cCerts = useCountUp(CERT_SEED.filter((c) => c.status === "COMPLETE").length + TRAINING.length);
  const cResolved = useCountUp(projectsDone);
  const cTools = useCountUp(19);

  const stats = [
    { label: "Total Projects", value: cProj, icon: FolderGit2, color: C.green },
    { label: "Certifications", value: cCerts, icon: Award, color: C.blue },
    { label: "Resolved Engagements", value: cResolved, icon: ShieldCheck, color: C.green },
    { label: "Tools & Platforms", value: cTools, icon: Wrench, color: C.dim },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header panel */}
      <Panel>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <ProfilePhoto size={140} ownerMode={ownerMode} />
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: C.green }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.green }} />
                {PROFILE.title}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: C.text }}>{PROFILE.name}</h1>
              <p className="max-w-xl text-xs leading-relaxed" style={{ color: C.dim }}>{PROFILE.summary}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Btn variant="primary" onClick={() => navigate("projects")}>View Projects <ChevronRight size={13} /></Btn>
            <Btn variant="outline" onClick={() => navigate("resume")}>Download CV <Download size={13} /></Btn>
            <Btn variant="ghost" onClick={() => navigate("contact")}>Contact Me</Btn>
          </div>
        </div>
      </Panel>

      {/* About summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="About" className="lg:col-span-2">
          <div className="space-y-3">
            {ABOUT_PARAGRAPHS.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed" style={{ color: C.dim }}>{p}</p>
            ))}
          </div>
        </Panel>
        <Panel title="Profile" padded={false}>
          {[
            { label: "Focus", value: PROFILE.focus, icon: ShieldAlert },
            { label: "Secondary Focus", value: PROFILE.secondaryFocus, icon: Cpu },
            { label: "Education", value: PROFILE.education, icon: GraduationCap },
            { label: "Location", value: PROFILE.location, icon: MapPin },
            { label: "Status", value: PROFILE.status, icon: Zap },
          ].map((c, i, arr) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i !== arr.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
              >
                <Icon size={15} style={{ color: C.green }} />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.faint }}>{c.label}</div>
                  <div className="text-xs font-semibold" style={{ color: C.text }}>{c.value}</div>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-5" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
              <div className="flex items-center justify-between mb-4">
                <Icon size={17} style={{ color: s.color }} />
                <Activity size={13} style={{ color: C.faint }} />
              </div>
              <div className="text-3xl font-bold font-mono" style={{ color: C.text }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: C.faint }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Portfolio Activity — Last 6 Months" right={<Zap size={13} style={{ color: C.green }} />} className="lg:col-span-2">
          {!activity ? (
            <div className="h-[190px] flex items-center justify-center text-xs" style={{ color: C.faint }}>Loading activity…</div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={activity}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="m" tick={{ fill: C.faint, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fill: C.faint, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS, fontSize: 12 }} labelStyle={{ color: C.text }} formatter={(v) => [v, "Updates"]} />
                <Area type="monotone" dataKey="a" stroke={C.green} strokeWidth={2} fill="url(#ga)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Capability Radar">
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={RADAR_DATA} outerRadius={62}>
              <PolarGrid stroke={C.borderSoft} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: C.faint, fontSize: 9 }} />
              <RRadar dataKey="value" stroke={C.green} fill={C.green} fillOpacity={0.22} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Proficiency + Recent engagements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel title="Proficiency Overview" className="lg:col-span-1">
          <div className="space-y-5">
            {PROFICIENCY.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: C.text }}>{p.label}</span>
                  <span className="font-mono" style={{ color: p.color }}>{p.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden" style={{ background: C.borderSoft, borderRadius: RADIUS }}>
                  <div className="h-full" style={{ width: `${p.value}%`, background: p.color }} />
                </div>
                <div className="text-[10px] mt-1" style={{ color: C.faint }}>{p.sub}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Recent Engagements"
          right={<button onClick={() => navigate("projects")} className="text-[11px] font-mono flex items-center gap-1" style={{ color: C.green }}>VIEW ALL <ChevronRight size={12} /></button>}
          className="lg:col-span-2"
          padded={false}
        >
          <div>
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => navigate("projects")}
                className="w-full flex items-center gap-3 py-2.5 px-4 text-left"
                style={{ borderBottom: i !== PROJECTS.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
              >
                <PriorityDot priority={p.priority} />
                <span className="flex-1 text-xs truncate" style={{ color: C.text }}>{p.title}</span>
                <span className="text-[10px] font-mono shrink-0" style={{ color: C.faint }}>{p.date}</span>
                <StatusPill status={p.status} />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [ownerMode, setOwnerMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openProject = (p) => setSelectedProject(p);

  const view = {
    dashboard: <Dashboard navigate={setActive} ownerMode={ownerMode} />,
    projects: <ProjectsPage onOpen={openProject} />,
    certificates: <CertificatesPage ownerMode={ownerMode} />,
    resume: <ResumePage ownerMode={ownerMode} />,
    skills: <SkillsPage />,
    experience: <ExperiencePage />,
    about: <AboutPage ownerMode={ownerMode} />,
    contact: <ContactPage />,
  }[active];

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: C.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar — always visible from md breakpoint up */}
        <div className="hidden md:block h-full">
          <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Mobile sidebar — off-canvas drawer, opened via the hamburger button */}
        {mobileNavOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,.6)" }}
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 h-full">
              <Sidebar
                active={active}
                setActive={setActive}
                collapsed={false}
                setCollapsed={() => {}}
                onClose={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar
            query={query}
            setQuery={setQuery}
            onNavigate={setActive}
            ownerMode={ownerMode}
            setOwnerMode={setOwnerMode}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: C.bg }}>
            {view}
          </div>
        </div>
      </div>
      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} ownerMode={ownerMode} />
    </div>
  );
}
