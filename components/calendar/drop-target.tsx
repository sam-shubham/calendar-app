"use client";

import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import type { Task } from "@/lib/types";
import type { AppDispatch } from "@/lib/redux/store";
import { createEvent } from "@/lib/redux/slices/eventSlice"; // Import the action creator

interface DropTargetProps {
  date: Date;
  time: string;
  onEventCreate: (
    date: Date,
    startTime: string,
    endTime: string,
    task: Task
  ) => void;
}

const DropTarget: React.FC<DropTargetProps> = ({
  date,
  time,
  onEventCreate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const elementRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      const hour = Number.parseInt(time.split(":")[0]);
      const isPM = time.includes("PM") && hour !== 12;
      const hour24 = isPM
        ? hour + 12
        : hour === 12 && time.includes("AM")
        ? 0
        : hour;

      const startTime = new Date(date);
      startTime.setHours(hour24, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);

      // Create the event data
      const eventData = {
        title: item.task.name,
        description: "",
        category: item.task.goalId ? "work" : "task", // Default to "work" or use task-specific category
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      // Dispatch the create event action
      dispatch(createEvent(eventData));

      // Also call the callback if provided
      onEventCreate(
        date,
        startTime.toISOString(),
        endTime.toISOString(),
        item.task
      );

      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Apply the drop ref to our DOM element
  dropRef(elementRef);

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${
        isOver
          ? "bg-blue-100 opacity-50 ring-2 ring-blue-400 ring-inset transition-colors duration-200"
          : ""
      }`}
      data-time={time}
      data-date={date.toISOString()}
    />
  );
};

export default DropTarget;
