import { MessageCircle } from "lucide-react";
import { useSite } from "@/lib/site";

export default function WhatsAppButton() {
  const { content } = useSite();
  const number = content.contact.whatsapp_number || "919889890386";
  const text = encodeURIComponent(
    "Hi PrismGrim! I'd like to know more about your services."
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3"
      data-testid="whatsapp-cta"
      aria-label="Chat on WhatsApp"
    >
      <span className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-[var(--pg-surface)] border border-[var(--pg-border)] font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--pg-text)]">
        Chat on WhatsApp
      </span>
      <span className="relative w-14 h-14 flex items-center justify-center bg-[#25D366] text-white shadow-lg shadow-[rgba(37,211,102,0.35)] hover:scale-105 transition-transform">
        <span className="absolute inset-0 rounded-none animate-ping bg-[#25D366] opacity-30" />
        <MessageCircle size={24} strokeWidth={2} />
      </span>
    </a>
  );
}
