import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Layout({ children }) {
  return (
    <div className="grain min-h-screen flex flex-col bg-[var(--pg-bg)] text-[var(--pg-text)]" data-testid="site-layout">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
