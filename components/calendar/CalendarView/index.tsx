"use client";

import { useState, useMemo } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import EventCard from "@/components/calendar/EventCard";
import { cn } from "@/lib/utils";

const DAY_HEADERS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const cells: (number | null)[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(-(daysInPrevMonth - i));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthDay(month: number, day: number): string {
  const SHORT_MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  return `${SHORT_MONTHS[month - 1]} ${String(day).padStart(2, "0")}`;
}

export default function CalendarView() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const { events, loading } = useCalendar(currentMonth.year, currentMonth.month);

  const monthGrid = useMemo(
    () => getMonthGrid(currentMonth.year, currentMonth.month),
    [currentMonth.year, currentMonth.month],
  );

  const eventDatesInMonth = useMemo(() => {
    const set = new Set<number>();
    events.forEach((e) => {
      const d = new Date(e.starts_at);
      if (d.getMonth() + 1 === currentMonth.month && d.getFullYear() === currentMonth.year) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [events, currentMonth.month, currentMonth.year]);

  const todayEvents = useMemo(() => {
    return events.filter((e) => isSameDay(new Date(e.starts_at), selectedDate));
  }, [events, selectedDate]);

  const tomorrowDate = useMemo(() => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [selectedDate]);

  const tomorrowEvents = useMemo(() => {
    return events.filter((e) => isSameDay(new Date(e.starts_at), tomorrowDate));
  }, [events, tomorrowDate]);

  function prevMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 1) return { year: prev.year - 1, month: 12 };
      return { ...prev, month: prev.month - 1 };
    });
  }

  function nextMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 12) return { year: prev.year + 1, month: 1 };
      return { ...prev, month: prev.month + 1 };
    });
  }

  const isSelectedInCurrentMonth =
    selectedDate.getMonth() + 1 === currentMonth.month &&
    selectedDate.getFullYear() === currentMonth.year;

  return (
    <div className="flex flex-col">
      {/* Month header */}
      <div className="flex items-end justify-between px-4 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1 text-[#555555] hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            {MONTH_NAMES[currentMonth.month - 1]}
          </h2>
          <button onClick={nextMonth} className="p-1 text-[#555555] hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <span className="text-lg font-semibold text-[#F5C200]">
          {currentMonth.year}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="mx-4 rounded-2xl bg-[#111111] p-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#555555]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {monthGrid.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7">
            {row.map((day, ci) => {
              if (day === null || day < 0) {
                const displayDay = day === null ? "" : Math.abs(day);
                return (
                  <div key={ci} className="flex flex-col items-center justify-center py-1.5">
                    <span className="text-sm text-[#333333]">{displayDay}</span>
                  </div>
                );
              }

              const cellDate = new Date(currentMonth.year, currentMonth.month - 1, day);
              const isSelected = isSelectedInCurrentMonth && selectedDate.getDate() === day;
              const isToday = isSameDay(cellDate, today);
              const hasEvent = eventDatesInMonth.has(day);

              return (
                <button
                  key={ci}
                  onClick={() => setSelectedDate(cellDate)}
                  className="flex flex-col items-center justify-center py-1.5 relative"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                      isSelected
                        ? "bg-[#F5C200] font-bold text-black"
                        : isToday
                          ? "ring-1 ring-[#F5C200] text-[#F5C200] font-semibold"
                          : "text-white hover:bg-[#1a1a1a]",
                    )}
                  >
                    {day}
                  </div>
                  {hasEvent && !isSelected && (
                    <div className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#F5C200]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Agenda do dia
          </h3>
          <span className="rounded-md bg-[#F5C200] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
            {formatMonthDay(selectedDate.getMonth() + 1, selectedDate.getDate())}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="h-6 w-6 animate-spin text-[#F5C200]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : todayEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#555555]">
            Nenhum evento neste dia
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {todayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Tomorrow */}
      {tomorrowEvents.length > 0 && (
        <div className="mt-6 px-4 pb-4">
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#555555]">
            Amanhã
          </h3>
          <div className="flex flex-col gap-2">
            {tomorrowEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
