import type { SupabaseClient } from "@supabase/supabase-js";
import type { Member } from "./members.types";

export async function getMemberById(
  client: SupabaseClient,
  id: string,
): Promise<{ data: Member | null; error: unknown }> {
  const { data, error } = await client
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as Member | null, error };
}

export async function upsertMember(
  client: SupabaseClient,
  member: Partial<Member> & { id: string },
): Promise<{ data: Member | null; error: unknown }> {
  const { data, error } = await client
    .from("members")
    .upsert(member)
    .select()
    .single();

  return { data: data as Member | null, error };
}
