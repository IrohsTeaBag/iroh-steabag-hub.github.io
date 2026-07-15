import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { C, RADIUS } from "../data";
import { useTimeline } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";

export function TimelineEntry({ entry, ownerMode, onUpdate, onDelete }) {
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

export function ExperiencePage({ ownerMode }) {
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

export default ExperiencePage;
