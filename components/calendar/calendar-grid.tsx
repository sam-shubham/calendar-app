"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addMinutes,
  setHours,
  setMinutes,
} from "date-fns";
import type { RootState } from "@/lib/redux/store";
import type { Event } from "@/lib/types";
import CalendarEvent from "./calendar-event";

interface CalendarGridProps {
  currentDate: Date;
  view: "day" | "week" | "month" | "year";
  onSlotSelect: (date: Date, startTime: string, endTime: string) => void;
  onEventSelect: (event: Event) => void;
}

const CalendarGrid = ({
  currentDate,
  view,
  onSlotSelect,
  onEventSelect,
}: CalendarGridProps) => {
  const events = useSelector((state: RootState) => state.events.events);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    // Generate time slots from 7 AM to 4 PM
    const slots = [];
    for (let i = 7; i <= 16; i++) {
      slots.push(`${i}:00 ${i < 12 ? "AM" : "PM"}`);
    }
    setTimeSlots(slots);

    // Generate days based on the current view
    if (view === "day") {
      setDays([currentDate]);
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      setDays(eachDayOfInterval({ start, end }));
    }
  }, [currentDate, view]);

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    // Parse the hour from the time slot
    const hour = Number.parseInt(timeSlot.split(":")[0]);
    const isPM = timeSlot.includes("PM") && hour !== 12;
    const slotHour24 = isPM ? hour + 12 : hour === 12 ? 0 : hour;

    // Create date objects for the start and end of this time slot
    const slotStart = new Date(day);
    slotStart.setHours(slotHour24, 0, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotHour24 + 1, 0, 0, 0);

    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      // Make sure the event starts in this time slot
      // Only show the event in the time slot where it begins
      return (
        isSameDay(day, eventStart) &&
        eventStart.getHours() === slotHour24 &&
        eventStart < slotEnd &&
        eventEnd > slotStart
      );
    });
  };

  const handleCellClick = (day: Date, timeSlot: string) => {
    const hour = Number.parseInt(timeSlot.split(":")[0]);
    const isPM = timeSlot.includes("PM") && hour !== 12;
    const hour24 = isPM ? hour + 12 : hour === 12 ? 0 : hour;

    const startTime = setHours(setMinutes(day, 0), hour24);
    const endTime = addMinutes(startTime, 30);

    onSlotSelect(
      day,
      format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      format(endTime, "yyyy-MM-dd'T'HH:mm:ss")
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-[auto_1fr] h-full">
        {/* Time labels */}
        <div className="flex flex-col border-r">
          <div className="h-16 border-b"></div> {/* Empty cell for header */}
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-16 px-2 py-1 text-right text-sm text-gray-500 border-b"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 flex-1">
          {/* Day headers */}
          {days.map((day) => (
            <div
              key={day.toString()}
              className="h-16 border-b border-r p-2 text-center"
            >
              <div className="font-medium">
                {format(day, "EEE").toUpperCase()}
              </div>
              <div className="text-2xl">{format(day, "d")}</div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot}>
              {days.map((day) => {
                const dayEvents = getEventsForDayAndTime(day, timeSlot);

                console.log(day);

                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="h-16 border-b border-r relative"
                    onClick={() => handleCellClick(day, timeSlot)}
                  >
                    {dayEvents.map((event) => (
                      <CalendarEvent
                        key={Math.random()}
                        event={event}
                        onEventSelect={onEventSelect}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
