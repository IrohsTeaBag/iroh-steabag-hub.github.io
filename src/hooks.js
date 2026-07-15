import React, { useState, useEffect } from "react";
import { PROFILE_SEED, ABOUT_BIO_SEED, PROFICIENCY_SEED, SKILL_GROUPS_SEED, PROJECT_SEED, CERT_SEED, TRAINING_SEED, TIMELINE_SEED, CONTACT_SEED, MONTH_LABELS } from "./data";

export function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useStoredJSON(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await window.storage.get(key, true);
        if (!cancelled) setValue(res ? JSON.parse(res.value) : fallback);
      } catch {
        if (!cancelled) setValue(fallback);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = async (next) => {
    setValue(next);
    try {
      await window.storage.set(key, JSON.stringify(next), true);
    } catch {
      /* optimistic UI already reflects the change */
    }
  };

  return [value, persist, loading];
}

export function useSeededList(key, seed) {
  const [stored, setStored, loading] = useStoredJSON(key, null);
  useEffect(() => {
    if (!loading && stored === null) setStored(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const list = stored && stored.length ? stored : seed;
  return [list, setStored, loading];
}

export function useProjects() {
  const [stored, setStored, loading] = useStoredJSON("projects", null);

  useEffect(() => {
    if (!loading && stored === null) {
      setStored(PROJECT_SEED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);

  const list = stored && stored.length ? stored : PROJECT_SEED;
  return [list, setStored, loading];
}

export function useProfile() {
  const [stored, setStored, loading] = useStoredJSON("profile-info", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(PROFILE_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const value = stored || PROFILE_SEED;
  return [value, setStored, loading];
}

export function useAboutBio() {
  const [stored, setStored, loading] = useStoredJSON("about-bio", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(ABOUT_BIO_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const paragraphs = stored && stored.length ? stored : ABOUT_BIO_SEED;
  return [paragraphs, setStored, loading];
}

export function useSkillGroups() {
  return useSeededList("skill-groups", SKILL_GROUPS_SEED);
}

export function useProficiency() {
  return useSeededList("proficiency", PROFICIENCY_SEED);
}

export function useTimeline() {
  return useSeededList("timeline", TIMELINE_SEED);
}

export function useTraining() {
  return useSeededList("training", TRAINING_SEED);
}

export function useCertificates() {
  const seeded = CERT_SEED.map((c, i) => ({ id: `seed-${i}`, credentialId: "", verifyUrl: "", fileDataUrl: null, fileName: null, ...c }));
  return useSeededList("certificates", seeded);
}

export function useContactInfo() {
  const [stored, setStored, loading] = useStoredJSON("contact-info", null);
  useEffect(() => {
    if (!loading && stored === null) setStored(CONTACT_SEED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stored]);
  const value = stored || CONTACT_SEED;
  return [value, setStored, loading];
}

export function useActivitySeries() {
  const [buckets, setBuckets] = useState(null); // null = still loading
  const [projects] = useProjects();
  const idsKey = projects.map((p) => p.id).join(",");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = {};
      const bump = (ts) => {
        if (!ts) return;
        const d = new Date(ts);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[key] = (map[key] || 0) + 1;
      };

      // Real project start months, e.g. "2026-05"
      projects.forEach((p) => {
        const m = /^(\d{4})-(\d{2})$/.exec(p.date);
        if (m) bump(`${m[1]}-${m[2]}-01`);
      });

      // Certificates added through owner mode (only ones with a real createdAt)
      try {
        const res = await window.storage.get("certificates", true);
        const certs = res ? JSON.parse(res.value) : [];
        certs.forEach((c) => bump(c.createdAt));
      } catch { /* none yet */ }

      // Videos and reports attached per project
      for (const p of projects) {
        try {
          const vres = await window.storage.get(`videos:${p.id}`, true);
          const vids = vres ? JSON.parse(vres.value) : [];
          vids.forEach((v) => bump(Number(v.id)));
        } catch { /* none yet */ }
        try {
          const rres = await window.storage.get(`report:${p.id}`, true);
          const rep = rres ? JSON.parse(rres.value) : null;
          if (rep?.createdAt) bump(rep.createdAt);
        } catch { /* none yet */ }
      }

      // CV upload
      try {
        const cvres = await window.storage.get("cv-document", true);
        const cv = cvres ? JSON.parse(cvres.value) : null;
        if (cv?.createdAt) bump(cv.createdAt);
      } catch { /* none yet */ }

      if (cancelled) return;

      const now = new Date();
      const series = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        series.push({ m: MONTH_LABELS[d.getMonth()], a: map[key] || 0 });
      }
      setBuckets(series);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return buckets;
}
