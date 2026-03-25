"use client";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { member } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between bg-[#0a0a0a] px-4">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#F5C200" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-wider text-[#F5C200]">
          Life House
        </span>
      </div>
      <Avatar
        src={member?.avatar_url}
        name={member?.full_name ?? "U"}
        size={32}
      />
    </header>
  );
}
