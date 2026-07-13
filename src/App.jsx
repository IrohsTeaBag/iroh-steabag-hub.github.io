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
const PROFILE_SEED = {
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

const ABOUT_BIO_SEED = [
  "Final-year Computer Systems Engineering student at Tshwane University of Technology, currently completing Work-Integrated Learning as a Cybersecurity Intern. My focus is web application security and SOC operations: I use Burp Suite and OWASP Top 10 methodology to assess vulnerabilities like SQLi, XSS, and API security issues, and I work with Wazuh and Microsoft Sentinel for threat detection.",
  "I also have growing experience in OT/ICS security, working with Siemens S7-1200 PLCs and SCADA protocols. That side of my work draws on a solid engineering background, including hands-on electronics and embedded systems projects using PIC and ESP32 microcontrollers, Arduino, and PLC ladder logic, so I understand both the IT and industrial sides of the systems I'm securing.",
  "I'm comfortable working across C++, C#, Python, and Assembly, and I'm building toward a career in blue team work.",
];

const PROFICIENCY_SEED = [
  { label: "Web AppSec", sub: "Primary focus", value: 75, color: C.green },
  { label: "SOC / SIEM", sub: "Threat detection", value: 88, color: C.blue },
  { label: "OT / ICS", sub: "Secondary skills", value: 65, color: C.dim },
];

const SKILL_GROUPS_SEED = [
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

const PROJECT_SEED = [
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

const TRAINING_SEED = [
  { name: "Blue Teaming Path (Modules 1, 2 & 3)", desc: "Defensive security, threat hunting, and incident response.", status: "COMPLETE", issued: "2026" },
  { name: "SOC Analyst Training (Tier 1, 2 & 3)", desc: "Alert triage, investigation, and escalation procedures.", status: "COMPLETE", issued: "2026" },
  { name: "MWR CyberSec: Firefly CTF", desc: "TryHackMe capstone challenge covering web exploitation.", status: "COMPLETE", issued: "2026" },
];

const TIMELINE_SEED = [
  { kind: "Employment", when: "CURRENT", title: "Cybersecurity Intern — Work Integrated Learning (WIL)", desc: "Hands-on exposure to OT/ICS security on a multi-year SCADA modernisation project for critical infrastructure." },
  { kind: "Education", when: "2022 – 2026", title: "Computer Systems Engineering", desc: "Tshwane University of Technology (TUT) — with a growing focus on cybersecurity and industrial control systems." },
];

const CONTACT_SEED = {
  linkedin: "https://www.linkedin.com/in/ngwakotumiso",
  github: "https://github.com/IrohsTeaBag",
  email: "ngwakotumiso01@gmail.com",
};

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

/** Shared live project list — seeded once from PROJECT_SEED, then owner-editable.
    Every component that needs "the current projects" (grid, dashboard stats,
    activity feed, search) uses this so newly added projects show up everywhere. */
function useProjects() {
  const [stored, setStored, loading] = useStoredJSON("projects", null);

  useEffect(() => {
    if (!loading && stored === null) {
      setStored(PROJECT_SEED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);

  const list = stored && stored.length ? stored : PROJECT_SEED;
  return [list, setStored, loading];
}

/** Generic "seeded list" hook — used for anything that's a simple owner-editable
    array seeded once from a starting constant (skills, timeline, credentials). */
function useSeededList(key, seed) {
  const [stored, setStored, loading] = useStoredJSON(key, null);
  useEffect(() => {
    if (!loading && stored === null) setStored(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const list = stored && stored.length ? stored : seed;
  return [list, setStored, loading];
}

function useProfile() {
  const [stored, setStored, loading] = useStoredJSON("profile-info", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(PROFILE_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const value = stored || PROFILE_SEED;
  return [value, setStored, loading];
}

function useAboutBio() {
  const [stored, setStored, loading] = useStoredJSON("about-bio", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(ABOUT_BIO_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const paragraphs = stored && stored.length ? stored : ABOUT_BIO_SEED;
  return [paragraphs, setStored, loading];
}

function useSkillGroups() {
  return useSeededList("skill-groups", SKILL_GROUPS_SEED);
}

function useProficiency() {
  return useSeededList("proficiency", PROFICIENCY_SEED);
}

function useTimeline() {
  return useSeededList("timeline", TIMELINE_SEED);
}

function useTraining() {
  return useSeededList("training", TRAINING_SEED);
}

function useCertificates() {
  const seeded = CERT_SEED.map((c, i) => ({ id: `seed-${i}`, credentialId: "", verifyUrl: "", fileDataUrl: null, fileName: null, ...c }));
  return useSeededList("certificates", seeded);
}

function useContactInfo() {
  const [stored, setStored, loading] = useStoredJSON("contact-info", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(CONTACT_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const value = stored || CONTACT_SEED;
  return [value, setStored, loading];
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
          <img src={photo.dataUrl} alt="Profile" className="w-full h-full object-cover" />
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

/* ============================== PROJECT THUMBNAIL (owner-uploadable) ============================== */
function ProjectThumbnail({ project, ownerMode }) {
  const [img, setImg] = useStoredJSON(`thumbnail:${project.id}`, null);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That image is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setImg({ dataUrl });
  }

  return (
    <div
      className="relative h-40 flex items-end p-6 overflow-hidden"
      style={{ background: img?.dataUrl ? "#000" : `linear-gradient(135deg, ${project.secondary ? C.purple : C.green}22, ${C.panel})` }}
    >
      {img?.dataUrl && (
        <>
          <img src={img.dataUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15))" }} />
        </>
      )}
      {ownerMode && (
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5"
            style={{ background: "rgba(0,0,0,.6)", color: "#fff", borderRadius: RADIUS }}
          >
            <Upload size={11} /> {img?.dataUrl ? "Replace image" : "Add image"}
          </button>
          {img?.dataUrl && (
            <button
              onClick={() => setImg(null)}
              className="p-1.5"
              style={{ background: "rgba(0,0,0,.6)", color: C.red, borderRadius: RADIUS }}
              title="Remove image"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: img?.dataUrl ? "#D8DEE6" : C.faint }}>{project.category}</span>
          <PriorityDot priority={project.priority} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: img?.dataUrl ? "#fff" : C.text }}>{project.title}</h2>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onClose, ownerMode }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(4,5,6,0.85)" }} onClick={onClose}>
      <div className="w-full max-w-3xl" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }} onClick={(e) => e.stopPropagation()}>
        <div className="relative" style={{ borderBottom: `1px solid ${C.border}` }}>
          <ProjectThumbnail project={project} ownerMode={ownerMode} />
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 shrink-0 z-10" style={{ background: "rgba(0,0,0,.6)", borderRadius: RADIUS }}>
            <X size={16} style={{ color: "#fff" }} />
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

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m, i) => (
                <div key={i} className="p-3 text-center" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
                  <div className="text-xs font-bold" style={{ color: C.text }}>{m.value}</div>
                  <div className="text-[10px] mt-1" style={{ color: C.faint }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}

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
function ProjectCard({ p, onOpen, ownerMode, onDelete }) {
  const [img] = useStoredJSON(`thumbnail:${p.id}`, null);
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS, position: "relative" }}>
      {ownerMode && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
          className="absolute top-3 right-3 p-1.5 z-10"
          style={{ background: "rgba(0,0,0,.6)", color: C.red, borderRadius: RADIUS }}
          title="Delete project"
        >
          <Trash2 size={13} />
        </button>
      )}
      <button onClick={() => onOpen(p)} className="w-full text-left p-5 flex flex-col h-full">
        <div className="h-24 mb-4 flex items-center justify-center overflow-hidden" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
          {img?.dataUrl ? (
            <img src={img.dataUrl} alt={p.title} className="w-full h-full object-cover" />
          ) : p.secondary ? (
            <Cpu size={26} style={{ color: C.blue }} />
          ) : (
            <Server size={26} style={{ color: C.green }} />
          )}
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

function ProjectsPage({ onOpen, ownerMode }) {
  const [projects, setProjects] = useProjects();
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "", date: "", priority: "Medium", status: "IN PROGRESS",
    difficulty: "Intermediate", description: "", overview: "", tags: "", tech: "",
    objectives: "", secondary: false,
  });

  const cats = ["All", ...new Set(projects.map((p) => p.category))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  function addProject(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newProject = {
      id: `project-${Date.now()}`,
      title: form.title.trim(),
      category: form.category.trim() || "Uncategorized",
      date: form.date.trim() || new Date().toISOString().slice(0, 7),
      priority: form.priority,
      status: form.status,
      difficulty: form.difficulty,
      secondary: form.secondary,
      description: form.description.trim(),
      overview: form.overview.trim() || form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      objectives: form.objectives.split("\n").map((t) => t.trim()).filter(Boolean),
      metrics: [],
    };
    setProjects([...projects, newProject]);
    setForm({ title: "", category: "", date: "", priority: "Medium", status: "IN PROGRESS", difficulty: "Intermediate", description: "", overview: "", tags: "", tech: "", objectives: "", secondary: false });
    setShowForm(false);
  }

  function deleteProject(id) {
    setProjects(projects.filter((p) => p.id !== id));
  }

  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="04" right={ownerMode && <Btn variant="primary" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add project</Btn>}>
        Projects
      </SectionEyebrow>

      {ownerMode && showForm && (
        <Panel title="New project" className="mb-6">
          <form onSubmit={addProject} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required placeholder="Project title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Category, e.g. Web Application Security" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Date, e.g. 2026-07 or 2026 — ongoing" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />

            <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option>IN PROGRESS</option><option>RESOLVED</option>
            </select>
            <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
            <label className="flex items-center gap-2 text-xs" style={{ color: C.dim }}>
              <input type="checkbox" checked={form.secondary} onChange={(e) => setForm((f) => ({ ...f, secondary: e.target.checked }))} />
              OT / ICS project (secondary focus styling)
            </label>

            <textarea placeholder="Short description (shown on the card)" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <textarea placeholder="Overview (shown on the detail page — leave blank to reuse the description)" rows={2} value={form.overview} onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <textarea placeholder={"Objectives — one per line"} rows={3} value={form.objectives} onChange={(e) => setForm((f) => ({ ...f, objectives: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <input placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Technologies, comma separated" value={form.tech} onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />

            <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save project</Btn>
          </form>
        </Panel>
      )}

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
        {filtered.map((p) => <ProjectCard key={p.id} p={p} onOpen={onOpen} ownerMode={ownerMode} onDelete={deleteProject} />)}
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

function CredentialSection({ n, title, credKey, useHook, ownerMode }) {
  const [list, setList, loading] = useHook();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });

  function addItem(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setList([...list, { id: `${Date.now()}`, createdAt: Date.now(), fileDataUrl: null, fileName: null, ...form }]);
    setForm({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });
    setShowForm(false);
  }
  function removeItem(id) { setList(list.filter((c) => c.id !== id)); }
  async function attachFile(id, file) {
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setList(list.map((c) => (c.id === id ? { ...c, fileDataUrl: dataUrl, fileName: file.name } : c)));
  }
  function removeFile(id) {
    setList(list.map((c) => (c.id === id ? { ...c, fileDataUrl: null, fileName: null } : c)));
  }

  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  return (
    <div>
      <SectionEyebrow n={n} right={ownerMode && <Btn variant="primary" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add {title.toLowerCase().replace(/&.*/, "").trim()}</Btn>}>
        {title}
      </SectionEyebrow>

      {ownerMode && showForm && (
        <Panel title={`New ${credKey}`} className="mb-6">
          <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option>COMPLETE</option>
              <option>PLANNED</option>
            </select>
            <input placeholder="Issued / completed (e.g. 2026)" value={form.issued} onChange={(e) => setForm((f) => ({ ...f, issued: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Credential ID (optional)" value={form.credentialId} onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Verification link (optional)" value={form.verifyUrl} onChange={(e) => setForm((f) => ({ ...f, verifyUrl: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
            <textarea placeholder="Short description" rows={2} value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save</Btn>
          </form>
        </Panel>
      )}

      {loading ? (
        <div className="text-xs" style={{ color: C.faint }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => (
            <CertCard key={c.id} c={c} ownerMode={ownerMode} onDelete={() => removeItem(c.id)} onAttach={(f) => attachFile(c.id, f)} onRemoveFile={() => removeFile(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificatesPage({ ownerMode }) {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10">
      <CredentialSection n="06" title="Certifications" credKey="certificate" useHook={useCertificates} ownerMode={ownerMode} />
      <CredentialSection n="—" title="Training & Self-Study" credKey="training entry" useHook={useTraining} ownerMode={ownerMode} />
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
  const [timeline] = useTimeline();
  const [skillGroups] = useSkillGroups();
  const [certs] = useCertificates();
  const [training] = useTraining();

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <SectionEyebrow n="—">CV</SectionEyebrow>

      <CVManager ownerMode={ownerMode} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Experience">
          {timeline.filter((t) => t.kind === "Employment").map((t, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.green, border: `1px solid ${C.green}33`, borderRadius: RADIUS }}>{t.when}</span>
              <div className="text-sm font-bold mt-2" style={{ color: C.text }}>{t.title}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.dim }}>{t.desc}</p>
            </div>
          ))}
        </Panel>

        <Panel title="Education">
          {timeline.filter((t) => t.kind === "Education").map((t, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.blue, border: `1px solid ${C.blue}33`, borderRadius: RADIUS }}>{t.when}</span>
              <div className="text-sm font-bold mt-2" style={{ color: C.text }}>{t.title}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.dim }}>{t.desc}</p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Skills Summary">
        <div className="flex flex-wrap gap-2">
          {skillGroups.flatMap((g) => g.skills).map((s) => (
            <span key={s.name} className="text-xs px-3 py-1.5" style={{ border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>{s.name}</span>
          ))}
        </div>
      </Panel>

      <Panel title="Achievements">
        <ul className="space-y-2">
          {[...certs, ...training].filter((c) => c.status === "COMPLETE").map((c, i) => (
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

function SkillCard({ skill, color, ownerMode, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(skill);
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function save(e) {
    e.preventDefault();
    onUpdate({ name: form.name.trim() || skill.name, detail: form.detail, level: Math.max(0, Math.min(100, Number(form.level) || 0)) });
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={save} className="p-4 space-y-2" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Skill name" className="w-full px-2 py-1.5 text-xs outline-none" style={inputStyle} />
        <input value={form.detail} onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))} placeholder="Detail" className="w-full px-2 py-1.5 text-xs outline-none" style={inputStyle} />
        <input type="number" min="0" max="100" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} placeholder="Level %" className="w-full px-2 py-1.5 text-xs outline-none" style={inputStyle} />
        <div className="flex gap-2">
          <Btn variant="primary" type="submit">Save</Btn>
          <Btn variant="ghost" type="button" onClick={() => setEditing(false)}>Cancel</Btn>
        </div>
      </form>
    );
  }

  return (
    <div className="p-4 relative" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS }}>
      {ownerMode && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button onClick={() => { setForm(skill); setEditing(true); }} className="text-[10px] font-mono px-1.5 py-0.5" style={{ color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>Edit</button>
          <button onClick={onDelete} className="p-1" style={{ color: C.red }} title="Delete skill"><Trash2 size={12} /></button>
        </div>
      )}
      <div className="flex justify-between items-center mb-1 pr-14">
        <span className="text-sm font-semibold" style={{ color: C.text }}>{skill.name}</span>
        <span className="text-xs font-mono shrink-0" style={{ color }}>{skill.level}%</span>
      </div>
      <div className="text-[11px] mb-2" style={{ color: C.faint }}>{skill.detail}</div>
      <div className="h-1.5 overflow-hidden" style={{ background: C.borderSoft, borderRadius: RADIUS }}>
        <div className="h-full" style={{ width: `${skill.level}%`, background: color }} />
      </div>
    </div>
  );
}

function SkillGroupSection({ group, ownerMode, onAddSkill, onUpdateSkill, onDeleteSkill, onDeleteGroup }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", detail: "", level: 60 });
  const inputStyle = { background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAddSkill({ name: form.name.trim(), detail: form.detail.trim(), level: Math.max(0, Math.min(100, Number(form.level) || 0)) });
    setForm({ name: "", detail: "", level: 60 });
    setShowAdd(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h3 className="text-sm font-bold" style={{ color: C.text }}>{group.group}</h3>
        <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: group.color, border: `1px solid ${group.color}33`, borderRadius: RADIUS }}>{group.tag}</span>
        {ownerMode && (
          <div className="flex gap-2 ml-auto">
            <Btn variant="ghost" onClick={() => setShowAdd((s) => !s)}><Plus size={11} /> Add skill</Btn>
            <Btn variant="danger" onClick={onDeleteGroup}><Trash2 size={11} /> Delete group</Btn>
          </div>
        )}
      </div>

      {ownerMode && showAdd && (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-3" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Skill name" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
          <input value={form.detail} onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))} placeholder="Detail" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
          <input type="number" min="0" max="100" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} placeholder="Level %" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
          <Btn variant="primary" type="submit">Add</Btn>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {group.skills.map((s, si) => (
          <SkillCard
            key={s.name + si}
            skill={s}
            color={group.color}
            ownerMode={ownerMode}
            onUpdate={(updated) => onUpdateSkill(si, updated)}
            onDelete={() => onDeleteSkill(si)}
          />
        ))}
        {group.skills.length === 0 && <div className="text-xs" style={{ color: C.faint }}>No skills in this group yet.</div>}
      </div>
    </div>
  );
}

function ProficiencyEditor({ ownerMode }) {
  const [proficiency, setProficiency] = useProficiency();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function startEdit() {
    setForm(proficiency.map((p) => ({ ...p })));
    setEditing(true);
  }
  function save(e) {
    e.preventDefault();
    setProficiency(form.map((p) => ({ ...p, value: Math.max(0, Math.min(100, Number(p.value) || 0)) })));
    setEditing(false);
  }
  function updateField(i, field, value) {
    setForm((f) => f.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  if (!ownerMode) return null;

  return (
    <div className="mb-4">
      <Btn variant="ghost" onClick={() => (editing ? setEditing(false) : startEdit())}>{editing ? "Cancel" : "Edit proficiency metrics"}</Btn>
      {editing && form && (
        <form onSubmit={save} className="mt-3 space-y-2">
          {form.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={p.label} onChange={(e) => updateField(i, "label", e.target.value)} placeholder="Label" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
              <input value={p.sub} onChange={(e) => updateField(i, "sub", e.target.value)} placeholder="Subtitle" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
              <input type="number" min="0" max="100" value={p.value} onChange={(e) => updateField(i, "value", e.target.value)} placeholder="Value %" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
            </div>
          ))}
          <Btn variant="primary" type="submit">Save metrics</Btn>
        </form>
      )}
    </div>
  );
}

/* ============================== SKILLS ============================== */
function SkillsPage({ ownerMode }) {
  const [groups, setGroups] = useSkillGroups();
  const [proficiency] = useProficiency();
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupForm, setGroupForm] = useState({ group: "", tag: "Custom", colorKey: "green" });
  const colorOptions = { green: C.green, blue: C.blue, dim: C.dim };
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function addGroup(e) {
    e.preventDefault();
    if (!groupForm.group.trim()) return;
    setGroups([...groups, { group: groupForm.group.trim(), tag: groupForm.tag.trim() || "Custom", color: colorOptions[groupForm.colorKey], skills: [] }]);
    setGroupForm({ group: "", tag: "Custom", colorKey: "green" });
    setShowGroupForm(false);
  }
  function deleteGroup(gi) { setGroups(groups.filter((_, i) => i !== gi)); }
  function addSkill(gi, skill) { setGroups(groups.map((g, i) => (i === gi ? { ...g, skills: [...g.skills, skill] } : g))); }
  function updateSkill(gi, si, updated) { setGroups(groups.map((g, i) => (i === gi ? { ...g, skills: g.skills.map((s, j) => (j === si ? updated : s)) } : g))); }
  function deleteSkill(gi, si) { setGroups(groups.map((g, i) => (i === gi ? { ...g, skills: g.skills.filter((_, j) => j !== si) } : g))); }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10">
      <SectionEyebrow n="02" right={ownerMode && <Btn variant="primary" onClick={() => setShowGroupForm((s) => !s)}><Plus size={12} /> Add skill group</Btn>}>
        Skills
      </SectionEyebrow>

      {ownerMode && showGroupForm && (
        <Panel title="New skill group">
          <form onSubmit={addGroup} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required placeholder="Group name" value={groupForm.group} onChange={(e) => setGroupForm((f) => ({ ...f, group: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input placeholder="Tag, e.g. Primary / Secondary" value={groupForm.tag} onChange={(e) => setGroupForm((f) => ({ ...f, tag: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <select value={groupForm.colorKey} onChange={(e) => setGroupForm((f) => ({ ...f, colorKey: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option value="green">Green accent</option>
              <option value="blue">Blue accent</option>
              <option value="dim">Neutral</option>
            </select>
            <Btn variant="primary" type="submit" className="md:col-span-3 justify-center">Save group</Btn>
          </form>
        </Panel>
      )}

      {groups.map((g, gi) => (
        <SkillGroupSection
          key={g.group + gi}
          group={g}
          ownerMode={ownerMode}
          onAddSkill={(skill) => addSkill(gi, skill)}
          onUpdateSkill={(si, updated) => updateSkill(gi, si, updated)}
          onDeleteSkill={(si) => deleteSkill(gi, si)}
          onDeleteGroup={() => deleteGroup(gi)}
        />
      ))}

      <div>
        <ProficiencyEditor ownerMode={ownerMode} />
        <Panel title="Proficiency Overview">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={proficiency}>
              <CartesianGrid stroke={C.borderSoft} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: C.faint, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: RADIUS }} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {proficiency.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

function TimelineEntry({ entry, ownerMode, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(entry);
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function save(e) {
    e.preventDefault();
    onUpdate(form);
    setEditing(false);
  }

  if (editing) {
    return (
      <Panel title="Edit entry">
        <form onSubmit={save} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))} className="px-2 py-1.5 text-xs outline-none" style={inputStyle}>
              <option>Employment</option>
              <option>Education</option>
            </select>
            <input value={form.when} onChange={(e) => setForm((f) => ({ ...f, when: e.target.value }))} placeholder="When, e.g. CURRENT or 2022 – 2026" className="px-2 py-1.5 text-xs outline-none" style={inputStyle} />
          </div>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="w-full px-2 py-1.5 text-xs outline-none" style={inputStyle} />
          <textarea value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-xs outline-none resize-none" style={inputStyle} />
          <div className="flex gap-2">
            <Btn variant="primary" type="submit">Save</Btn>
            <Btn variant="ghost" type="button" onClick={() => setEditing(false)}>Cancel</Btn>
          </div>
        </form>
      </Panel>
    );
  }

  return (
    <Panel title={entry.kind} right={ownerMode && (
      <div className="flex items-center gap-2">
        <button onClick={() => { setForm(entry); setEditing(true); }} className="text-[10px] font-mono px-1.5 py-0.5" style={{ color: C.dim, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>Edit</button>
        <button onClick={onDelete} style={{ color: C.red }} title="Delete entry"><Trash2 size={13} /></button>
      </div>
    )}>
      <span className="text-[10px] font-mono px-2 py-0.5" style={{ color: C.green, border: `1px solid ${C.green}33`, borderRadius: RADIUS }}>{entry.when}</span>
      <h3 className="text-sm font-bold mt-2 mb-1.5" style={{ color: C.text }}>{entry.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: C.dim }}>{entry.desc}</p>
    </Panel>
  );
}

/* ============================== EXPERIENCE / TIMELINE ============================== */
function ExperiencePage({ ownerMode }) {
  const [timeline, setTimeline] = useTimeline();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kind: "Employment", when: "", title: "", desc: "" });
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function addEntry(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTimeline([...timeline, { ...form }]);
    setForm({ kind: "Employment", when: "", title: "", desc: "" });
    setShowForm(false);
  }
  function updateEntry(i, updated) { setTimeline(timeline.map((t, idx) => (idx === i ? updated : t))); }
  function deleteEntry(i) { setTimeline(timeline.filter((_, idx) => idx !== i)); }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="05" right={ownerMode && <Btn variant="primary" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add entry</Btn>}>
        Timeline
      </SectionEyebrow>

      {ownerMode && showForm && (
        <Panel title="New timeline entry" className="mb-6">
          <form onSubmit={addEntry} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle}>
              <option>Employment</option>
              <option>Education</option>
            </select>
            <input placeholder="When, e.g. CURRENT or 2024 – 2026" value={form.when} onChange={(e) => setForm((f) => ({ ...f, when: e.target.value }))} className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
            <textarea placeholder="Description" rows={2} value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save entry</Btn>
          </form>
        </Panel>
      )}

      <div className="relative pl-8">
        <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: C.border }} />
        {timeline.map((t, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            <div className="absolute -left-8 top-1 h-3 w-3" style={{ background: t.kind === "Employment" ? C.green : C.blue, borderRadius: RADIUS }} />
            <TimelineEntry entry={t} ownerMode={ownerMode} onUpdate={(u) => updateEntry(i, u)} onDelete={() => deleteEntry(i)} />
          </div>
        ))}
        {timeline.length === 0 && <div className="text-xs" style={{ color: C.faint }}>No timeline entries yet.</div>}
      </div>
    </div>
  );
}

/* ============================== ABOUT ============================== */
function ProfileBioEditor({ ownerMode }) {
  const [profile, setProfile] = useProfile();
  const [bio, setBio] = useAboutBio();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function startEdit() {
    setForm({ ...profile, bioText: bio.join("\n\n") });
    setEditing(true);
  }
  function save(e) {
    e.preventDefault();
    const { bioText, ...profileFields } = form;
    setProfile(profileFields);
    const paragraphs = bioText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    setBio(paragraphs.length ? paragraphs : ABOUT_BIO_SEED);
    setEditing(false);
  }

  if (!ownerMode) return null;

  return (
    <div className="mb-6">
      <Btn variant="primary" onClick={() => (editing ? setEditing(false) : startEdit())}>
        {editing ? "Cancel" : <><Upload size={12} /> Edit profile &amp; about</>}
      </Btn>
      {editing && form && (
        <Panel title="Edit profile & about" className="mt-3">
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Location" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} placeholder="Status" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.education} onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))} placeholder="Education" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.focus} onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))} placeholder="Focus" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.secondaryFocus} onChange={(e) => setForm((f) => ({ ...f, secondaryFocus: e.target.value }))} placeholder="Secondary focus" className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
            <textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Short summary (shown on the Dashboard header)" rows={2} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <textarea value={form.bioText} onChange={(e) => setForm((f) => ({ ...f, bioText: e.target.value }))} placeholder="About bio — separate paragraphs with a blank line" rows={7} className="md:col-span-2 px-3 py-2 text-xs outline-none resize-none" style={inputStyle} />
            <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save changes</Btn>
          </form>
        </Panel>
      )}
    </div>
  );
}

/* ============================== ABOUT ============================== */
function AboutPage({ ownerMode }) {
  const [profile] = useProfile();
  const [bio] = useAboutBio();
  const infoCards = [
    { label: "Focus", value: profile.focus, icon: ShieldAlert },
    { label: "Secondary Focus", value: profile.secondaryFocus, icon: Cpu },
    { label: "Education", value: profile.education, icon: GraduationCap },
    { label: "Location", value: profile.location, icon: MapPin },
    { label: "Status", value: profile.status, icon: Zap },
  ];
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="01">About</SectionEyebrow>
      <ProfileBioEditor ownerMode={ownerMode} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {bio.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: C.dim }}>{p}</p>
          ))}
        </div>
        <div className="space-y-3">
          <Panel>
            <div className="flex items-center gap-3">
              <ProfilePhoto size={56} ownerMode={ownerMode} />
              <div>
                <div className="text-sm font-bold" style={{ color: C.text }}>{profile.name}</div>
                <div className="text-[11px]" style={{ color: C.faint }}>{profile.title}</div>
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
function ContactPage({ ownerMode }) {
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useContactInfo();
  const [profile] = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const inputStyle = { background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS };

  function startEdit() {
    setForm({ ...contact });
    setEditing(true);
  }
  function saveContact(e) {
    e.preventDefault();
    setContact(form);
    setEditing(false);
  }

  const links = [
    { label: "LinkedIn", icon: Linkedin, value: contact.linkedin.replace(/^https?:\/\//, ""), href: contact.linkedin },
    { label: "GitHub", icon: Github, value: contact.github.replace(/^https?:\/\//, ""), href: contact.github },
    { label: "Email", icon: Mail, value: contact.email, href: `mailto:${contact.email}` },
    { label: "Location", icon: MapPin, value: profile.location },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <SectionEyebrow n="—" right={ownerMode && <Btn variant="primary" onClick={() => (editing ? setEditing(false) : startEdit())}>{editing ? "Cancel" : "Edit contact info"}</Btn>}>
        Contact
      </SectionEyebrow>

      {ownerMode && editing && form && (
        <Panel title="Edit contact info" className="mb-6">
          <form onSubmit={saveContact} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} placeholder="LinkedIn URL" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} placeholder="GitHub URL" className="px-3 py-2 text-xs outline-none" style={inputStyle} />
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email address" className="md:col-span-2 px-3 py-2 text-xs outline-none" style={inputStyle} />
            <Btn variant="primary" type="submit" className="md:col-span-2 justify-center">Save contact info</Btn>
          </form>
        </Panel>
      )}

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
  const [projects] = useProjects();
  const idsKey = projects.map((p) => p.id).join(",");

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
      projects.forEach((p) => {
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
      for (const p of projects) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return buckets;
}

/* ============================== DASHBOARD ============================== */
function Dashboard({ navigate, ownerMode }) {
  const activity = useActivitySeries();
  const [projects] = useProjects();
  const [profile] = useProfile();
  const [bio] = useAboutBio();
  const [proficiency] = useProficiency();
  const [certs] = useCertificates();
  const [training] = useTraining();
  const projectsDone = projects.filter((p) => p.status === "RESOLVED").length;
  const cProj = useCountUp(projects.length);
  const cCerts = useCountUp(certs.filter((c) => c.status === "COMPLETE").length + training.length);
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
                {profile.title}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: C.text }}>{profile.name}</h1>
              <p className="max-w-xl text-xs leading-relaxed" style={{ color: C.dim }}>{profile.summary}</p>
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
            {bio.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed" style={{ color: C.dim }}>{p}</p>
            ))}
          </div>
        </Panel>
        <Panel title="Profile" padded={false}>
          {[
            { label: "Focus", value: profile.focus, icon: ShieldAlert },
            { label: "Secondary Focus", value: profile.secondaryFocus, icon: Cpu },
            { label: "Education", value: profile.education, icon: GraduationCap },
            { label: "Location", value: profile.location, icon: MapPin },
            { label: "Status", value: profile.status, icon: Zap },
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
            {proficiency.map((p, i) => (
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
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => navigate("projects")}
                className="w-full flex items-center gap-3 py-2.5 px-4 text-left"
                style={{ borderBottom: i !== projects.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}
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
    projects: <ProjectsPage onOpen={openProject} ownerMode={ownerMode} />,
    certificates: <CertificatesPage ownerMode={ownerMode} />,
    resume: <ResumePage ownerMode={ownerMode} />,
    skills: <SkillsPage ownerMode={ownerMode} />,
    experience: <ExperiencePage ownerMode={ownerMode} />,
    about: <AboutPage ownerMode={ownerMode} />,
    contact: <ContactPage ownerMode={ownerMode} />,
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
