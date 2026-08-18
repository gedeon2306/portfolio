import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";
import CertificatesPage from "./pages/CertificatesPage";
import ProjectsPage from "./pages/ProjectsPage";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import { loadSiteSettings } from "./config";
import SkeletonLayout from "./components/SkeletonLayout";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await loadSiteSettings();
        if (mounted) setMaintenance(!!s.modeMaintenance);
      } catch (e) {
        // ignore and keep default
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        {loading ? (
          <SkeletonLayout />
        ) : maintenance ? (
          <Maintenance />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PortfolioPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}