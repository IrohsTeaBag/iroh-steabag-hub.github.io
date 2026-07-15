import React, { useState } from "react";
import { Cpu, Zap, MapPin, GraduationCap, ShieldAlert, Upload } from "lucide-react";
import { C, RADIUS, ABOUT_BIO_SEED } from "../data";
import { useProfile, useAboutBio } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";
import ProfilePhoto from "../components/ProfilePhoto";

export function ProfileBioEditor({ ownerMode }) {
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

export function AboutPage({ ownerMode }) {
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

export default AboutPage;
