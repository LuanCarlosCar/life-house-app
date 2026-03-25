import type { SupabaseClient } from "@supabase/supabase-js";
import type { Event } from "./events.types";

export async function getEventsByMonth(
  client: SupabaseClient,
  year: number,
  month: number,
): Promise<{ data: Event[] | null; error: unknown }> {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const { data, error } = await client
    .from("events")
    .select("*")
    .gte("starts_at", startDate)
    .lt("starts_at", endDate)
    .order("starts_at", { ascending: true });

  return { data: data as Event[] | null, error };
}
