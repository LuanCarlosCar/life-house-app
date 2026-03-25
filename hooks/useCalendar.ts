"use client";

import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { createClient } from "@/lib/supabase/client";
import { getEventsByMonth } from "@/services/events/events.service";
import { eventsCacheAtom, calendarLoadingAtom, calendarErrorAtom } from "@/stores/calendar";
import type { Event } from "@/services/events/events.types";

interface UseCalendarReturn {
  events: Event[];
  loading: boolean;
  error: unknown;
}

export function useCalendar(year: number, month: number): UseCalendarReturn {
  const [cache, setCache] = useAtom(eventsCacheAtom);
  const [loading, setLoading] = useAtom(calendarLoadingAtom);
  const [error, setError] = useAtom(calendarErrorAtom);

  const key = `${year}-${month}`;

  useEffect(() => {
    if (cache[key]) return;

    setLoading(true);

    const supabase = createClient();
    getEventsByMonth(supabase, year, month).then(({ data, error: err }) => {
      setCache((prev) => ({ ...prev, [key]: data ?? [] }));
      setError(err);
      setLoading(false);
    });
  }, [key, cache, setCache, setLoading, setError, year, month]);

  const events = useMemo(() => cache[key] ?? [], [cache, key]);

  return { events, loading: !cache[key] && loading, error };
}
