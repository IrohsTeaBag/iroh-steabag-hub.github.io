import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { C, RADIUS, MAX_UPLOAD_BYTES } from "../data";
import { fileToDataURL, useStoredJSON } from "../hooks";

function ProfilePhoto({ size = 96, ownerMode }) {
  const [photo, setPhoto] = useStoredJSON("profile-photo", null).slice(0, 2);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) { alert("That image is too large. Please use a file under 4MB."); return; }
    const dataUrl = await fileToDataURL(file);
    setPhoto({ dataUrl });
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: RADIUS }}
      >
        {photo?.dataUrl ? (
          <img src={photo.dataUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono font-bold" style={{ color: C.dim, fontSize: size * 0.28 }}>TN</span>
        )}
      </div>
      {ownerMode && (
        <button
          onClick={() => inputRef.current?.click()}
          title="Change profile photo"
          className="absolute -bottom-2 -right-2 p-1.5"
          style={{ background: C.green, borderRadius: RADIUS }}
        >
          <Upload size={12} color="#04140B" />
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}

export default ProfilePhoto;
