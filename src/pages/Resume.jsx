import React, { useState, useRef } from "react";
import { Download, Eye, ShieldCheck, Trash2, Upload } from "lucide-react";
import { C, RADIUS } from "../data";
import { useStoredJSON, useSkillGroups, useTimeline, useTraining, useCertificates } from "../hooks";
import { SectionEyebrow, Btn, Panel } from "../ui";
import DocumentLightbox from "../components/DocumentLightbox";
import { fileStorageReady, uploadFile, deleteFile, downloadUrl, MAX_FILE_BYTES } from "../fileStorage";

export function CVManager({ ownerMode }) {
  const [cv, setCv, loading] = useStoredJSON("cv-document", null);
  const [viewing, setViewing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { alert(`That file is too large (max ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB).`); return; }
    if (!fileStorageReady()) { alert("CV upload needs the Supabase Storage bucket set up first — see the README."); return; }
    setUploading(true);
    try {
      const uploaded = await uploadFile(file, "cv");
      if (cv?.path) deleteFile(cv.path);
      setCv({ ...uploaded, uploadedAt: new Date().toLocaleDateString(), createdAt: Date.now() });
    } catch (err) {
      alert(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeCv() {
    if (cv?.path) deleteFile(cv.path);
    setCv(null);
  }

  return (
    <Panel title="Curriculum Vitae" right={ownerMode && (
      <div className="flex gap-2">
        <Btn variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}><Upload size={12} /> {uploading ? "Uploading…" : cv ? "Replace" : "Upload"}</Btn>
        {cv && <Btn variant="danger" onClick={removeCv}><Trash2 size={12} /> Remove</Btn>}
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
          <div className="flex gap-2">
            <Btn variant="primary" onClick={() => setViewing(true)}><Eye size={12} /> View CV</Btn>
            <a href={downloadUrl(cv.url, cv.filename)}><Btn variant="outline"><Download size={12} /> Download</Btn></a>
          </div>
        </div>
      ) : (
        <div className="text-xs" style={{ color: C.faint }}>{ownerMode ? "No CV uploaded yet — upload one above." : "CV not yet available."}</div>
      )}
      {viewing && <DocumentLightbox doc={cv} onClose={() => setViewing(false)} />}
    </Panel>
  );
}

export function ResumePage({ ownerMode }) {
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

export default ResumePage;
