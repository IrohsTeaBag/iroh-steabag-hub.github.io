import React, { useState, useRef } from "react";
import { FileText, ExternalLink, Download, Trash2, Plus, Upload } from "lucide-react";
import { C, RADIUS, MAX_UPLOAD_BYTES } from "../data";
import { useTraining, useCertificates, fileToDataURL } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";

function isImageDataUrl(dataUrl) {
  return typeof dataUrl === "string" && dataUrl.startsWith("data:image");
}

export function CertCard({ c, ownerMode, onDelete, onAttach, onRemoveFile, attaching }) {
  const inputRef = useRef(null);
  const hasFile = !!c.fileDataUrl;
  const isImage = hasFile && isImageDataUrl(c.fileDataUrl);

  return (
    <Panel title={c.status} right={ownerMode && onDelete && (
      <button onClick={onDelete} title="Delete certificate"><Trash2 size={13} style={{ color: C.red }} /></button>
    )}>
      {hasFile && isImage && (
        <div
          className="w-full h-32 mb-3 overflow-hidden"
          style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, background: C.panelAlt }}
        >
          <img src={c.fileDataUrl} alt={c.name} className="w-full h-full object-cover" />
        </div>
      )}
      {hasFile && !isImage && (
        <div
          className="w-full h-16 mb-3 flex items-center justify-center gap-2"
          style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, background: C.panelAlt, color: C.dim }}
        >
          <FileText size={16} /> <span className="text-xs">{c.fileName || "Document attached"}</span>
        </div>
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
            <a href={c.fileDataUrl} download={c.fileName}><Btn variant="outline"><Download size={11} /> Download</Btn></a>
          )}
          {ownerMode && onAttach && (
            <>
              <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onAttach(f); }} />
              <Btn variant="ghost" onClick={() => inputRef.current?.click()} disabled={attaching}>
                <Upload size={11} /> {attaching ? "Uploading…" : hasFile ? "Replace" : "Attach"}
              </Btn>
              {hasFile && onRemoveFile && <Btn variant="danger" onClick={onRemoveFile}><Trash2 size={11} /></Btn>}
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

export function CredentialSection({ n, title, credKey, useHook, ownerMode }) {
  const [list, setList, loading] = useHook();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });
  const [attachingId, setAttachingId] = useState(null);

  function addItem(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setList([...list, { id: `${Date.now()}`, createdAt: Date.now(), fileDataUrl: null, fileName: null, ...form }]);
    setForm({ name: "", desc: "", status: "COMPLETE", issued: "", credentialId: "", verifyUrl: "" });
    setShowForm(false);
  }
  function removeItem(id) {
    setList(list.filter((c) => c.id !== id));
  }
  async function attachFile(id, file) {
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    setAttachingId(id);
    try {
      const dataUrl = await fileToDataURL(file);
      setList(list.map((c) => (c.id === id ? { ...c, fileDataUrl: dataUrl, fileName: file.name } : c)));
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setAttachingId(null);
    }
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
            <CertCard key={c.id} c={c} ownerMode={ownerMode} onDelete={() => removeItem(c.id)} onAttach={(f) => attachFile(c.id, f)} onRemoveFile={() => removeFile(c.id)} attaching={attachingId === c.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CertificatesPage({ ownerMode }) {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10">
      <CredentialSection n="06" title="Certifications" credKey="certificate" useHook={useCertificates} ownerMode={ownerMode} />
      <CredentialSection n="—" title="Training & Self-Study" credKey="training entry" useHook={useTraining} ownerMode={ownerMode} />
    </div>
  );
}

export default CertificatesPage;
