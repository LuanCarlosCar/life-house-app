import { atom } from "jotai";
import type { Event } from "@/services/events/events.types";

export const eventsCacheAtom = atom<Record<string, Event[]>>({});
export const calendarLoadingAtom = atom(false);
export const calendarErrorAtom = atom<unknown>(null);
