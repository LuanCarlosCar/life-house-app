import LoginButton from "@/components/auth/LoginButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#0a0a0a] px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-[320px]">
        <div className="flex flex-col items-center gap-4">
          {/* Lightning bolt icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5C200]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0a0a0a" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              LIFE HOUSE
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#888888]">
              Gestão de Presença
            </p>
          </div>
        </div>
        <LoginButton />
        <div className="flex items-center gap-3 mt-4">
          <div className="h-px w-12 bg-[#2a2a2a]" />
          <span className="text-[10px] uppercase tracking-widest text-[#555555]">
            Auth Secure
          </span>
          <div className="h-px w-12 bg-[#2a2a2a]" />
        </div>
      </div>
    </div>
  );
}
