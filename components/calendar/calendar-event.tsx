"use client";

import type React from "react";

import { useState } from "react";
import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { AppDispatch } from "@/lib/redux/store";

interface CalendarEventProps {
  event: Event;
  onEventSelect: (event: Event) => void;
}

const CalendarEvent = ({ event, onEventSelect }: CalendarEventProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { id: event._id, event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "exercise":
        return "bg-green-100 border-green-500 text-green-700";
      case "eating":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "work":
        return "bg-blue-100 border-blue-500 text-blue-700";
      case "relax":
        return "bg-purple-100 border-purple-500 text-purple-700";
      case "family":
        return "bg-pink-100 border-pink-500 text-pink-700";
      case "social":
        return "bg-orange-100 border-orange-500 text-orange-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  const calculateEventHeight = () => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

    // Each hour is 64px (h-16), so 1 minute is 64/60 = 1.067px
    return `${durationMinutes * 1.067}px`;
  };

  const calculateEventTop = () => {
    const start = new Date(event.startTime);
    const minutes = start.getMinutes();

    // Each hour is 64px (h-16), so 1 minute is 64/60 = 1.067px
    return `${minutes * 1.067}px`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={drag}
      className={cn(
        "absolute left-0 right-0 mx-1 p-1 rounded border-l-4 cursor-pointer text-xs overflow-hidden",
        getCategoryColor(event.category),
        isDragging ? "opacity-50" : "opacity-100"
      )}
      style={{
        height: isExpanded ? "auto" : calculateEventHeight(),
        top: calculateEventTop(),
        zIndex: isExpanded ? 10 : 1,
      }}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">{event.title}</span>
        <button onClick={handleToggleExpand} className="text-xs">
          {isExpanded ? "−" : "+"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-1">
          <p className="text-xs">
            {new Date(event.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {new Date(event.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs">{event.category}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarEvent;
