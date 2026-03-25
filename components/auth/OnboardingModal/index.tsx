"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertMember } from "@/services/members/members.service";
import type { Member } from "@/services/members/members.types";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface OnboardingModalProps {
  userId: string;
  defaultName: string;
  onComplete: (member: Member) => void;
}

export default function OnboardingModal({
  userId,
  defaultName,
  onComplete,
}: OnboardingModalProps) {
  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  async function handleSubmit() {
    const newErrors: { fullName?: string; phone?: string } = {};
    if (!fullName.trim()) newErrors.fullName = "Nome é obrigatório";
    if (!phone.trim()) newErrors.phone = "Telefone é obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const supabase = createClient();
    const { data, error } = await upsertMember(supabase, {
      id: userId,
      full_name: fullName.trim(),
      phone: phone.trim(),
    });

    if (error || !data) {
      setErrors({ phone: "Erro ao salvar. Tente novamente." });
      setLoading(false);
      return;
    }

    onComplete(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85" />
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Lightning icon */}
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C200]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#0a0a0a" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Complete seu perfil
          </h2>
          <p className="text-sm text-[#888888] mb-8">
            Precisamos de mais alguns detalhes para personalizar sua experiência na Life House.
          </p>

          <div className="flex flex-col gap-6">
            {/* Nome completo */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Seu nome"
                className="w-full border-b border-[#2a2a2a] bg-transparent pb-3 pt-1 text-white outline-none placeholder:text-[#555555] focus:border-[#F5C200] transition-colors"
              />
              {errors.fullName && (
                <span className="text-[11px] text-[#EF4444]">{errors.fullName}</span>
              )}
            </div>

            {/* Celular */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
                Celular
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="(00) 00000-0000"
                className="w-full border-b border-[#2a2a2a] bg-transparent pb-3 pt-1 text-white outline-none placeholder:text-[#555555] focus:border-[#F5C200] transition-colors"
              />
              {errors.phone && (
                <span className="text-[11px] text-[#EF4444]">{errors.phone}</span>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#F5C200] font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <span className="text-sm">Salvar e Continuar</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
