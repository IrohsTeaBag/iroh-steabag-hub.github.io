import { LayoutDashboard, FolderGit2, Award, User as UserIcon, Wrench, Briefcase, Mail, GraduationCap } from "lucide-react";

export const C = {
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

export const RADIUS = 3;
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // headroom under the 5MB per-key storage limit

/* ============================== DATA ============================== */
export const PROFILE_SEED = {
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

export const ABOUT_BIO_SEED = [
  "Final-year Computer Systems Engineering student at Tshwane University of Technology, currently completing Work-Integrated Learning as a Cybersecurity Intern. My focus is web application security and SOC operations: I use Burp Suite and OWASP Top 10 methodology to assess vulnerabilities like SQLi, XSS, and API security issues, and I work with Wazuh and Microsoft Sentinel for threat detection.",
  "I also have growing experience in OT/ICS security, working with Siemens S7-1200 PLCs and SCADA protocols. That side of my work draws on a solid engineering background, including hands-on electronics and embedded systems projects using PIC and ESP32 microcontrollers, Arduino, and PLC ladder logic, so I understand both the IT and industrial sides of the systems I'm securing.",
  "I'm comfortable working across C++, C#, Python, and Assembly, and I'm building toward a career in blue team work.",
];

export const PROFICIENCY_SEED = [
  { label: "Web AppSec", sub: "Primary focus", value: 75, color: C.green },
  { label: "SOC / SIEM", sub: "Threat detection", value: 88, color: C.blue },
  { label: "OT / ICS", sub: "Secondary skills", value: 65, color: C.dim },
];

export const SKILL_GROUPS_SEED = [
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

export const PROJECT_SEED = [
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

export const CERT_SEED = [
  { name: "MWR CyberSec Virtual Internship Certificate", desc: "Web application penetration testing methodology.", status: "COMPLETE", issued: "2026" },
  { name: "EC-Council SOC Analyst (CSA) Short Course", desc: "Foundational training in SOC procedures, threat monitoring, and incident response.", status: "COMPLETE", issued: "2026" },
  { name: "Sigma White Belt Certification", desc: "Introduction to Sigma rules and detection engineering principles.", status: "COMPLETE", issued: "2026" },
  { name: "Microsoft Azure Fundamentals (AZ-900)", desc: "Core Azure cloud concepts and security fundamentals.", status: "PLANNED", issued: null },
  { name: "SC-900 · Security, Compliance & Identity", desc: "Next on the list.", status: "PLANNED", issued: null },
  { name: "CompTIA Security+", desc: "Vendor-neutral security foundation.", status: "PLANNED", issued: null },
];

export const TRAINING_SEED = [
  { name: "Blue Teaming Path (Modules 1, 2 & 3)", desc: "Defensive security, threat hunting, and incident response.", status: "COMPLETE", issued: "2026" },
  { name: "SOC Analyst Training (Tier 1, 2 & 3)", desc: "Alert triage, investigation, and escalation procedures.", status: "COMPLETE", issued: "2026" },
  { name: "MWR CyberSec: Firefly CTF", desc: "TryHackMe capstone challenge covering web exploitation.", status: "COMPLETE", issued: "2026" },
];

export const TIMELINE_SEED = [
  { kind: "Employment", when: "CURRENT", title: "Cybersecurity Intern — Work Integrated Learning (WIL)", desc: "Hands-on exposure to OT/ICS security on a multi-year SCADA modernisation project for critical infrastructure." },
  { kind: "Education", when: "2022 – 2026", title: "Computer Systems Engineering", desc: "Tshwane University of Technology (TUT) — with a growing focus on cybersecurity and industrial control systems." },
];

export const CONTACT_SEED = {
  linkedin: "https://www.linkedin.com/in/ngwakotumiso",
  github: "https://github.com/IrohsTeaBag",
  email: "ngwakotumiso01@gmail.com",
};

export const RADAR_DATA = [
  { subject: "Web AppSec", value: 75 },
  { subject: "SOC/SIEM", value: 88 },
  { subject: "OT/ICS", value: 65 },
  { subject: "Recon", value: 78 },
  { subject: "Scripting", value: 76 },
  { subject: "Cloud", value: 70 },
];

export const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "experience", label: "Experience", icon: GraduationCap },
  { id: "about", label: "About", icon: UserIcon },
  { id: "resume", label: "CV", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export const OWNER_PASSCODE = "ngwako-owner";
