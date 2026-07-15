import React from "react";
import { FolderGit2, Award, Wrench, ChevronRight, Download, Activity, Cpu, Zap, MapPin, GraduationCap, ShieldAlert, ShieldCheck } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar as RRadar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { C, RADIUS, RADAR_DATA } from "../data";
import { useCountUp, useProjects, useProfile, useAboutBio, useProficiency, useTraining, useCertificates, useActivitySeries } from "../hooks";
import { StatusPill, PriorityDot, Btn, Panel } from "../ui";
import ProfilePhoto from "../components/ProfilePhoto";

export function Dashboard({ navigate, ownerMode }) {
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

export default Dashboard;
