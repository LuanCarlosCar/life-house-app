import { atom } from "jotai";
import type { Event } from "@/services/events/events.types";

export const eventsAtom = atom<Event[]>([]);
export const calendarLoadingAtom = atom(true);
export const calendarErrorAtom = atom<unknown>(null);
