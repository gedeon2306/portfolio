import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";
import CertificatesPage from "./pages/CertificatesPage";
import ProjectsPage from "./pages/ProjectsPage";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import { loadSiteSettings, type SiteSettings } from "./config";
import SkeletonLayout from "./components/skeletonComponents/SkeletonLayout";
import { useEffect, useState, createContext, useContext } from "react";

interface SettingsContextType extends SiteSettings {
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings doit être utilisé à l\'intérieur d\'un SettingsProvider');
  }
  return context;
}

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsContextType>({
    modeMaintenance: false,
    linkedin: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await loadSiteSettings();
        if (mounted) {
          setSettings({
            modeMaintenance: s.modeMaintenance,
            linkedin: s.linkedin || null,
            loading: false,
          });
        }
      } catch (e) {
        if (mounted) {
          setSettings(prev => ({ ...prev, loading: false }));
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { modeMaintenance, loading } = useSettings();

  if (loading) {
    return <SkeletonLayout />;
  }

  if (modeMaintenance) {
    return <Maintenance />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}