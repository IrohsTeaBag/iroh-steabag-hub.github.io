import React, { useState, useRef } from "react";
import { FileText, ChevronRight, Github, Download, CheckCircle2, X, Cpu, Server, PlayCircle, Trash2, Plus, Upload } from "lucide-react";
import { C, RADIUS, MAX_UPLOAD_BYTES } from "../data";
import { fileToDataURL, useStoredJSON, useProjects } from "../hooks";
import { StatusPill, PriorityDot, SectionEyebrow, Btn, Panel } from "../ui";
import { videoUploadReady, generateVideoThumbnail, uploadVideoFile, deleteVideoFile, MAX_VIDEO_BYTES } from "../videoUpload";

export function ProjectThumbnail({ project, ownerMode }) {
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

export function ProjectVideos({ project, ownerMode }) {
  const [videos, setVideos, loading] = useStoredJSON(`videos:${project.id}`, []);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("upload"); // "upload" | "link"
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState("Subsystem");
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef(null);

  const storageReady = videoUploadReady();

  function resetForm() {
    setTitle(""); setUrl(""); setKind("Subsystem"); setShowForm(false); setUploadError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function addLinkVideo(e) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setVideos([...videos, { id: `${Date.now()}`, title: title.trim(), url: url.trim(), kind, source: "link" }]);
    resetForm();
  }

  async function addUploadedVideo(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!title.trim() || !file) return;
    if (file.size > MAX_VIDEO_BYTES) {
      setUploadError(`That file is too large (max ${Math.round(MAX_VIDEO_BYTES / 1024 / 1024)}MB).`);
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const [thumb, uploaded] = await Promise.all([
        generateVideoThumbnail(file).catch(() => null),
        uploadVideoFile(file, `videos/${project.id}`),
      ]);
      setVideos([...videos, {
        id: `${Date.now()}`, title: title.trim(), kind, source: "upload",
        url: uploaded.url, storagePath: uploaded.path, thumb,
      }]);
      resetForm();
    } catch (err) {
      setUploadError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeVideo(v) {
    setVideos(videos.filter((x) => x.id !== v.id));
    if (v.source === "upload" && v.storagePath) deleteVideoFile(v.storagePath);
  }

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
  function tileImage(v) {
    if (v.thumb) return v.thumb;
    const yt = youtubeId(v.url || "");
    return yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null;
  }

  return (
    <Panel title="Videos" right={ownerMode && (
      <Btn variant="ghost" onClick={() => setShowForm((s) => !s)}><Plus size={12} /> Add video</Btn>
    )}>
      {ownerMode && showForm && (
        <div className="mb-4 p-3" style={{ background: C.panelAlt, border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS }}>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setMode("upload")} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider" style={{ background: mode === "upload" ? C.green : "transparent", color: mode === "upload" ? "#04140B" : C.dim, border: `1px solid ${mode === "upload" ? C.green : C.border}`, borderRadius: RADIUS }}>Upload file</button>
            <button type="button" onClick={() => setMode("link")} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider" style={{ background: mode === "link" ? C.green : "transparent", color: mode === "link" ? "#04140B" : C.dim, border: `1px solid ${mode === "link" ? C.green : C.border}`, borderRadius: RADIUS }}>Paste link</button>
          </div>

          {mode === "upload" ? (
            storageReady ? (
              <form onSubmit={addUploadedVideo} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, e.g. Detection Rules" className="md:col-span-2 px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
                <select value={kind} onChange={(e) => setKind(e.target.value)} className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>
                  <option>Full Demo</option>
                  <option>Subsystem</option>
                </select>
                <input ref={fileRef} type="file" accept="video/*" className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
                <Btn variant="primary" type="submit" className="md:col-span-4 justify-center" disabled={uploading}>{uploading ? "Uploading…" : "Upload & save video"}</Btn>
                {uploadError && <div className="md:col-span-4 text-[11px]" style={{ color: C.red }}>{uploadError}</div>}
              </form>
            ) : (
              <div className="text-xs" style={{ color: C.faint }}>
                Direct upload needs a Supabase Storage bucket set up first — see the README ("Direct video uploads" section). Use "Paste link" for now.
              </div>
            )
          ) : null}

          {mode === "link" && (
            <form onSubmit={addLinkVideo} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, e.g. Detection Rules" className="md:col-span-2 px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Video URL" className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }} />
              <select value={kind} onChange={(e) => setKind(e.target.value)} className="px-2 py-1.5 text-xs outline-none" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text, borderRadius: RADIUS }}>
                <option>Full Demo</option>
                <option>Subsystem</option>
              </select>
              <Btn variant="primary" type="submit" className="md:col-span-4 justify-center">Save video</Btn>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-xs" style={{ color: C.faint }}>Loading videos…</div>
      ) : videos.length === 0 ? (
        <div className="text-xs" style={{ color: C.faint }}>No videos added for this project yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {videos.map((v) => {
            const img = tileImage(v);
            return (
              <div key={v.id} className="relative" style={{ border: `1px solid ${C.borderSoft}`, borderRadius: RADIUS, overflow: "hidden" }}>
                <button
                  onClick={() => setLightbox(v)}
                  className="w-full h-20 flex items-center justify-center relative"
                  style={{ background: img ? `${C.panelAlt} url(${img}) center/cover no-repeat` : C.panelAlt }}
                >
                  {img && <div className="absolute inset-0" style={{ background: "rgba(0,0,0,.35)" }} />}
                  <PlayCircle size={20} style={{ color: C.green, position: "relative" }} />
                </button>
                <div className="px-2 py-1.5" style={{ background: C.panel }}>
                  <div className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{v.title}</div>
                  <div className="text-[10px]" style={{ color: C.faint }}>{v.kind}</div>
                </div>
                {ownerMode && (
                  <button onClick={() => removeVideo(v)} className="absolute top-1.5 right-1.5 p-1" style={{ background: "rgba(0,0,0,.65)", borderRadius: RADIUS }} title="Delete video">
                    <Trash2 size={12} style={{ color: C.red }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,.85)" }} onClick={() => setLightbox(null)}>
          <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm" style={{ color: "#fff" }}>{lightbox.title}</div>
              <button onClick={() => setLightbox(null)}><X size={18} color="#fff" /></button>
            </div>
            {lightbox.source === "upload" ? (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[80vh]" style={{ borderRadius: RADIUS, background: "#000" }} />
            ) : embedUrl(lightbox.url) ? (
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

export function ProjectReport({ project, ownerMode }) {
  const [report, setReport] = useStoredJSON(`report:${project.id}`, null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That file is too large. Please use a file under 4MB."); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToDataURL(file);
      setReport({ dataUrl, filename: file.name, uploadedAt: new Date().toLocaleDateString(), createdAt: Date.now() });
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeReport() {
    setReport(null);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
      {report ? (
        <a href={report.dataUrl} download={report.filename}><Btn variant="primary"><Download size={12} /> Download Report</Btn></a>
      ) : (
        <Btn variant="outline" disabled><FileText size={12} /> Report not yet available</Btn>
      )}
      {ownerMode && (
        <>
          <Btn variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}><Upload size={12} /> {uploading ? "Uploading…" : report ? "Replace report" : "Upload report"}</Btn>
          {report && <Btn variant="danger" onClick={removeReport}><Trash2 size={12} /></Btn>}
        </>
      )}
    </div>
  );
}

export function ProjectCodeLink({ project, ownerMode }) {
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

export function ProjectDetail({ project, onClose, ownerMode }) {
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

export function ProjectCard({ p, onOpen, ownerMode, onDelete }) {
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

export function ProjectsPage({ ownerMode }) {
  const [projects, setProjects] = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
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
        {filtered.map((p) => <ProjectCard key={p.id} p={p} onOpen={setSelectedProject} ownerMode={ownerMode} onDelete={deleteProject} />)}
      </div>
      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} ownerMode={ownerMode} />
    </div>
  );
}

export default ProjectsPage;
