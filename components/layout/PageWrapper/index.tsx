"use client";

import Header from "@/components/layout/Header";
import FooterNav from "@/components/layout/FooterNav";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <FooterNav />
    </div>
  );
}
