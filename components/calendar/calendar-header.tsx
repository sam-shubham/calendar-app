"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, subDays, addMonths, subMonths } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week" | "month" | "year";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "week") => void;
}

const CalendarHeader = ({
  currentDate,
  view,
  onDateChange,
  onViewChange,
}: CalendarHeaderProps) => {
  const navigatePrevious = () => {
    if (view === "day") {
      onDateChange(subDays(currentDate, 1));
    } else if (view === "week") {
      onDateChange(subDays(currentDate, 7));
    } else if (view === "month") {
      onDateChange(subMonths(currentDate, 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear() - 1, 0, 1));
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      onDateChange(addDays(currentDate, 1));
    } else if (view === "week") {
      onDateChange(addDays(currentDate, 7));
    } else if (view === "month") {
      onDateChange(addMonths(currentDate, 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear() + 1, 0, 1));
    }
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {view === "day" && format(currentDate, "MMMM d, yyyy")}
          {view === "week" && format(currentDate, "MMMM yyyy")}
          {view === "month" && format(currentDate, "MMMM yyyy")}
          {view === "year" && format(currentDate, "yyyy")}
        </h2>
      </div>
      <div className="flex space-x-2">
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => onViewChange("day")}
        >
          Day
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => onViewChange("week")}
        >
          Week
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
