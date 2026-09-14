"use client";

import { getWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppFloat({
  phone,
  message,
}: {
  phone: string;
  message?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={getWhatsAppLink(phone, message ?? "Hello, I'm interested in your wholesale beauty products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
