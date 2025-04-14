"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CalendarHeader from "./calendar-header";
import CalendarGrid from "./calendar-grid";
import Sidebar from "./sidebar";
import EventModal from "./event-modal";
import { fetchEvents } from "@/lib/redux/slices/eventSlice";
import { fetchGoals, fetchTasks } from "@/lib/redux/slices/taskSlice";
import type { AppDispatch } from "@/lib/redux/store";
import type { Event } from "@/lib/types";

const Calendar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchGoals());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (newView: "day" | "week") => {
    setView(newView);
  };

  const handleSlotSelect = (date: Date, startTime: string, endTime: string) => {
    setSelectedSlot({ date, startTime, endTime });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onDateChange={handleDateChange}
            onViewChange={handleViewChange}
          />
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            onSlotSelect={handleSlotSelect}
            onEventSelect={handleEventSelect}
          />
        </div>
        {showModal && (
          <EventModal
            isOpen={showModal}
            onClose={handleCloseModal}
            event={selectedEvent}
            selectedSlot={selectedSlot}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Calendar;
