"use client";

import { useAuthInit, useAuth } from "@/hooks/useAuth";
import PageWrapper from "@/components/layout/PageWrapper";
import OnboardingModal from "@/components/auth/OnboardingModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useAuthInit();
  const { user, member, loading, setMember } = useAuth();

  const needsOnboarding =
    user && !loading && (!member || !member.phone);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a]">
        <svg className="h-8 w-8 animate-spin text-[#F5C200]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <PageWrapper>
      {needsOnboarding && user && (
        <OnboardingModal
          userId={user.id}
          defaultName={user.user_metadata?.full_name ?? ""}
          onComplete={(saved) => setMember(saved)}
        />
      )}
      {children}
    </PageWrapper>
  );
}
