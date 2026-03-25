import { atom } from "jotai";
import type { User } from "@supabase/supabase-js";
import type { Member } from "@/services/members/members.types";

export const userAtom = atom<User | null>(null);
export const memberAtom = atom<Member | null>(null);
export const authLoadingAtom = atom(true);
