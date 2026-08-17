import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";
import CertificatesPage from "./pages/CertificatesPage";
import ProjectsPage from "./pages/ProjectsPage";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import { MAINTENANCE } from "./config";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {MAINTENANCE ? (
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