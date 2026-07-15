import React, { useState, Suspense, lazy } from "react";
import { C } from "./data";
import { Sidebar, Topbar } from "./components/Shell";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/Projects"));
const CertificatesPage = lazy(() => import("./pages/Certificates"));
const ResumePage = lazy(() => import("./pages/Resume"));
const SkillsPage = lazy(() => import("./pages/Skills"));
const ExperiencePage = lazy(() => import("./pages/Experience"));
const AboutPage = lazy(() => import("./pages/About"));
const ContactPage = lazy(() => import("./pages/Contact"));

function PageLoading() {
  return (
    <div className="flex items-center justify-center h-full py-24">
      <div className="text-xs font-mono" style={{ color: C.faint }}>Loading…</div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [ownerMode, setOwnerMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const view = {
    dashboard: <Dashboard navigate={setActive} ownerMode={ownerMode} />,
    projects: <ProjectsPage ownerMode={ownerMode} />,
    certificates: <CertificatesPage ownerMode={ownerMode} />,
    resume: <ResumePage ownerMode={ownerMode} />,
    skills: <SkillsPage ownerMode={ownerMode} />,
    experience: <ExperiencePage ownerMode={ownerMode} />,
    about: <AboutPage ownerMode={ownerMode} />,
    contact: <ContactPage ownerMode={ownerMode} />,
  }[active];

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: C.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar — always visible from md breakpoint up */}
        <div className="hidden md:block h-full">
          <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Mobile sidebar — off-canvas drawer, opened via the hamburger button */}
        {mobileNavOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,.6)" }}
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 h-full">
              <Sidebar
                active={active}
                setActive={setActive}
                collapsed={false}
                setCollapsed={() => {}}
                onClose={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar
            query={query}
            setQuery={setQuery}
            onNavigate={setActive}
            ownerMode={ownerMode}
            setOwnerMode={setOwnerMode}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: C.bg }}>
            <Suspense fallback={<PageLoading />}>{view}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
