import React from "react";
import { Download, X } from "lucide-react";
import { C, RADIUS } from "../data";
import { downloadUrl, isPdfFile, isImageFile } from "../fileStorage";

function DocumentLightbox({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6" style={{ background: "rgba(0,0,0,.85)" }} onClick={onClose}>
      <div className="w-full max-w-3xl h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2 gap-3">
          <div className="text-sm truncate" style={{ color: "#fff" }}>{doc.filename}</div>
          <div className="flex items-center gap-3 shrink-0">
            <a href={downloadUrl(doc.url, doc.filename)} className="text-xs underline" style={{ color: "#fff" }}>Download</a>
            <button onClick={onClose}><X size={18} color="#fff" /></button>
          </div>
        </div>
        <div className="flex-1 min-h-0" style={{ background: "#111", borderRadius: RADIUS, overflow: "hidden" }}>
          {isPdfFile(doc.filename) ? (
            <iframe src={doc.url} className="w-full h-full" style={{ border: "none" }} title={doc.filename} />
          ) : isImageFile(doc.filename) ? (
            <img src={doc.url} alt={doc.filename} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm underline" style={{ color: C.blue }}>Open file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentLightbox;
