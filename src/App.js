import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/Layout";
import HomePage from "@/pages/Home";
import ServicesPage from "@/pages/Services";
import AboutPage from "@/pages/About";
import PortfolioPage from "@/pages/Portfolio";
import CareersPage from "@/pages/Careers";
import ContactPage from "@/pages/Contact";
import FeedbackPage from "@/pages/Feedback";
import AdminPage from "@/pages/Admin";
import InvoicePrintPage from "@/pages/InvoicePrint";
import { ThemeProvider } from "@/lib/theme";
import { SiteContentProvider } from "@/lib/site";
import "@/App.css";

function Shell({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SiteContentProvider>
          <div className="App">
            <BrowserRouter>
              <Toaster
                position="top-right"
                theme="system"
                toastOptions={{
                  style: {
                    background: "var(--pg-surface)",
                    border: "1px solid var(--pg-border)",
                    color: "var(--pg-text)",
                    borderRadius: "2px",
                    fontFamily: "IBM Plex Sans, sans-serif",
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Shell><HomePage /></Shell>} />
                <Route path="/services" element={<Shell><ServicesPage /></Shell>} />
                <Route path="/about" element={<Shell><AboutPage /></Shell>} />
                <Route path="/portfolio" element={<Shell><PortfolioPage /></Shell>} />
                <Route path="/careers" element={<Shell><CareersPage /></Shell>} />
                <Route path="/contact" element={<Shell><ContactPage /></Shell>} />
                <Route path="/feedback" element={<Shell><FeedbackPage /></Shell>} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/invoice/:id/print" element={<InvoicePrintPage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SiteContentProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
