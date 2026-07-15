import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { C, RADIUS } from "../data";
import { useSkillGroups, useProficiency } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";

export function SkillCard({ skill, color, ownerMode, onUpdate, onDelete }) {
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

export function SkillGroupSection({ group, ownerMode, onAddSkill, onUpdateSkill, onDeleteSkill, onDeleteGroup }) {
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

export function ProficiencyEditor({ ownerMode }) {
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

export function SkillsPage({ ownerMode }) {
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

export default SkillsPage;
