import React, { useState } from "react";
import { Lock, Eye, Unlock } from "lucide-react";
import { C, RADIUS, OWNER_PASSCODE } from "../data";

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

export default OwnerToggle;
