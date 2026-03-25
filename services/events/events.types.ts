export type EventType = "igreja" | "celula";
export type RecurrenceType = "none" | "weekly" | "biweekly" | "monthly";

export interface Event {
  id: string;
  title: string;
  type: EventType;
  celula_id: string | null;
  location: string | null;
  starts_at: string;
  recurrence: RecurrenceType;
  recurrence_end: string | null;
  created_by: string | null;
  created_at: string;
}
