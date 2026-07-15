import React, { useState } from "react";
import { Mail, Github, Linkedin, ExternalLink, Clock, MapPin, Send, ShieldCheck } from "lucide-react";
import { C, RADIUS } from "../data";
import { useProfile, useContactInfo } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";

export function ContactPage({ ownerMode }) {
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

export default ContactPage;
