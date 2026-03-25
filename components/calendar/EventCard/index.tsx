"use client";

import type { Event } from "@/services/events/events.types";

interface EventCardProps {
  event: Event;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getEndTime(isoString: string): string {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 1, date.getMinutes() + 30);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function EventCard({ event }: EventCardProps) {
  const isIgreja = event.type === "igreja";
  const typeLabel = isIgreja ? "IGREJA" : "CÉLULA";

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#1a1a1a] p-4">
      <div className="flex flex-1 flex-col gap-2">
        {/* Time range */}
        <span className="text-[12px] font-medium text-[#888888]">
          {formatTime(event.starts_at)} — {getEndTime(event.starts_at)}
        </span>

        {/* Title */}
        <h4 className="text-[15px] font-semibold text-white">
          {event.title}
        </h4>

        {/* Badges */}
        <div className="flex items-center gap-1.5">
          <span className="rounded-md bg-[#222222] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#888888]">
            {typeLabel}
          </span>
          {event.location && (
            <span className="rounded-md bg-[#222222] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#888888]">
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail placeholder */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#222222]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    </div>
  );
}
