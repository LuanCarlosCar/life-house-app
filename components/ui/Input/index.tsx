"use client";

import { cn } from "@/lib/utils";

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}

export default function Input({
  label,
  error,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] text-[#888888]">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full rounded-[10px] bg-[#1a1a1a] border px-4 py-3.5",
          "text-white placeholder:text-[#888888]",
          "transition-colors outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-[#EF4444] focus:border-[#EF4444]"
            : "border-[#2a2a2a] focus:border-[#F5C200]",
        )}
      />
      {error && (
        <span className="text-[12px] text-[#EF4444]">{error}</span>
      )}
    </div>
  );
}
