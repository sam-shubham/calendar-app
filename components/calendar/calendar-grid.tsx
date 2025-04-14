"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  isToday,
  addDays,
  parseISO,
} from "date-fns";
import { useDrop } from "react-dnd";
import type { RootState } from "@/lib/redux/store";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import CalendarEvent from "./calendar-event";

interface CalendarGridProps {
  currentDate: Date;
  view: "day" | "week" | "month" | "year";
  onSlotSelect: (date: Date, startTime: string, endTime: string) => void;
  onEventSelect: (event: Event) => void;
}

const HOURS_TO_DISPLAY = { start: 7, end: 20 }; // 7 AM to 8 PM

const CalendarGrid = ({
  currentDate,
  view,
  onSlotSelect,
  onEventSelect,
}: CalendarGridProps) => {
  const events = useSelector((state: RootState) => state.events.events);
  const dropRef = useRef<HTMLDivElement>(null);

  // Generate time slots only when the range changes
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = HOURS_TO_DISPLAY.start; i <= HOURS_TO_DISPLAY.end; i++) {
      const hour12 = i > 12 ? i - 12 : i;
      const amPm = i >= 12 ? "PM" : "AM";
      slots.push(`${hour12}:00 ${amPm}`);
    }
    return slots;
  }, [HOURS_TO_DISPLAY.start, HOURS_TO_DISPLAY.end]);

  // Generate days based on the current view
  const days = useMemo(() => {
    if (view === "day") {
      return [currentDate];
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }
    return [];
  }, [currentDate, view]);

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    // Parse the time slot
    const [timeText, amPm] = timeSlot.split(" ");
    let [hourStr] = timeText.split(":");
    let hour = parseInt(hourStr, 10);

    // Convert to 24-hour format
    if (amPm === "PM" && hour !== 12) {
      hour += 12;
    } else if (amPm === "AM" && hour === 12) {
      hour = 0;
    }

    // Create date objects for the start and end of this time slot
    const slotStart = setHours(setMinutes(day, 0), hour);
    const slotEnd = addHours(slotStart, 1);

    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      // Make sure the event starts in this time slot
      // Only show the event in the time slot where it begins
      return (
        isSameDay(day, eventStart) &&
        eventStart.getHours() === hour &&
        eventStart < slotEnd &&
        eventEnd > slotStart
      );
    });
  };

  const handleCellClick = (day: Date, timeSlot: string) => {
    // Parse the time slot
    const [timeText, amPm] = timeSlot.split(" ");
    let [hourStr] = timeText.split(":");
    let hour = parseInt(hourStr, 10);

    // Convert to 24-hour format
    if (amPm === "PM" && hour !== 12) {
      hour += 12;
    } else if (amPm === "AM" && hour === 12) {
      hour = 0;
    }

    const startTime = setHours(setMinutes(day, 0), hour);
    const endTime = addMinutes(startTime, 60);

    onSlotSelect(
      day,
      format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      format(endTime, "yyyy-MM-dd'T'HH:mm:ss")
    );
  };

  // Set up drag and drop for events
  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item: { id: string; event: Event }, monitor) => {
      // Get drop position to calculate new event time
      const dropResult = monitor.getDropResult();
      // Handle the dropped event (implement this as needed)
      console.log("Dropped event:", item.event);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect the drop ref to our element ref
  drop(dropRef);

  // Helper function to add hours to a date
  const addHours = (date: Date, hours: number): Date => {
    return addMinutes(date, hours * 60);
  };

  // Helper function to format time slot label
  const formatTimeSlot = (timeSlot: string): string => {
    const [time, amPm] = timeSlot.split(" ");
    return `${time} ${amPm}`;
  };

  // Get current hour to highlight current time
  const currentHour = new Date().getHours();

  return (
    <div className="flex-1 overflow-auto p-2" ref={dropRef}>
      <div className="grid grid-cols-[60px_1fr] h-full bg-white rounded-lg shadow-sm">
        {/* Time labels column */}
        <div className="flex flex-col border-r">
          <div className="h-16 border-b bg-gray-50 rounded-tl-lg"></div>
          {/* Empty cell for header */}
          {timeSlots.map((time) => (
            <div
              key={time}
              className={cn(
                "h-16 px-2 py-1 text-right text-xs font-medium border-b flex flex-col justify-start",
                currentHour === getHourFromTimeSlot(time) &&
                  isToday(currentDate)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500"
              )}
            >
              <span>{formatTimeSlot(time)}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          }}
        >
          {/* Day headers */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "h-16 border-b border-r p-2 text-center flex flex-col justify-center",
                isToday(day) ? "bg-blue-50" : "bg-gray-50",
                day === days[days.length - 1] ? "rounded-tr-lg" : ""
              )}
            >
              <div className="font-medium text-xs text-gray-500">
                {format(day, "EEEE").toUpperCase()}
              </div>
              <div
                className={cn(
                  "mt-1 font-bold text-lg flex items-center justify-center w-8 h-8 rounded-full mx-auto",
                  isToday(day) ? "bg-blue-500 text-white" : "text-gray-800"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}

          {/* Time slots grid */}
          {timeSlots.map((timeSlot) => (
            <React.Fragment key={timeSlot}>
              {days.map((day) => {
                const dayEvents = getEventsForDayAndTime(day, timeSlot);
                const hour = getHourFromTimeSlot(timeSlot);
                const isCurrentTimeSlot = currentHour === hour && isToday(day);

                return (
                  <div
                    key={`${format(day, "yyyy-MM-dd")}-${timeSlot}`}
                    className={cn(
                      "h-16 border-b border-r relative group p-1",
                      isCurrentTimeSlot ? "bg-blue-50" : "hover:bg-gray-50"
                    )}
                    onClick={() => handleCellClick(day, timeSlot)}
                  >
                    {/* Horizontal line for half-hour mark */}
                    <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100"></div>

                    {/* Current time indicator */}
                    {isCurrentTimeSlot && (
                      <div className="absolute left-0 right-0 border-t-2 border-red-500 z-10"></div>
                    )}

                    {/* Add event button on hover */}
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(day, timeSlot);
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Calendar events */}
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
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get hour from time slot
const getHourFromTimeSlot = (timeSlot: string): number => {
  const [timeText, amPm] = timeSlot.split(" ");
  let [hourStr] = timeText.split(":");
  let hour = parseInt(hourStr, 10);

  // Convert to 24-hour format
  if (amPm === "PM" && hour !== 12) {
    hour += 12;
  } else if (amPm === "AM" && hour === 12) {
    hour = 0;
  }

  return hour;
};

export default CalendarGrid;
