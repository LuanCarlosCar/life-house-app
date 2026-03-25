"use client";

import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { createClient } from "@/lib/supabase/client";
import { getEventsByMonth } from "@/services/events/events.service";
import { eventsAtom, calendarLoadingAtom, calendarErrorAtom } from "@/stores/calendar";
import type { Event } from "@/services/events/events.types";

interface UseCalendarReturn {
  events: Event[];
  loading: boolean;
  error: unknown;
}

export function useCalendar(year: number, month: number): UseCalendarReturn {
  const [events, setEvents] = useAtom(eventsAtom);
  const [loading, setLoading] = useAtom(calendarLoadingAtom);
  const [error, setError] = useAtom(calendarErrorAtom);
  const lastKeyRef = useRef("");

  useEffect(() => {
    const key = `${year}-${month}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    setLoading(true);

    const supabase = createClient();
    getEventsByMonth(supabase, year, month).then(({ data, error: err }) => {
      if (lastKeyRef.current !== key) return;
      setEvents(data ?? []);
      setError(err);
      setLoading(false);
    });
  }, [year, month, setEvents, setLoading, setError]);

  return { events, loading, error };
}
