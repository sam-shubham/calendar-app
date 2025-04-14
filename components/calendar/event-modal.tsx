"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format, isAfter, parseISO } from "date-fns";
import { Calendar, Clock, Tag, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEvents,
} from "@/lib/redux/slices/eventSlice";
import { toast } from "@/components/ui/use-toast";
import type { Event } from "@/lib/types";
import type { AppDispatch } from "@/lib/redux/store";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange?: VoidFunction;
  event: Event | null;
  selectedSlot: {
    date: Date;
    startTime: string;
    endTime: string;
  } | null;
}

const CATEGORIES = [
  { value: "exercise", label: "Exercise", icon: "🏃" },
  { value: "eating", label: "Eating", icon: "🍽️" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "relax", label: "Relax", icon: "🧘" },
  { value: "family", label: "Family", icon: "👪" },
  { value: "social", label: "Social", icon: "🎉" },
];

const EventModal = ({
  isOpen,
  onClose,
  event,
  selectedSlot,
}: EventModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    if (event) {
      setTitle(event.title);
      setCategory(event.category);
      setDescription("");
      setDate(format(new Date(event.date), "yyyy-MM-dd"));
      setStartTime(format(new Date(event.startTime), "HH:mm"));
      setEndTime(format(new Date(event.endTime), "HH:mm"));
    } else if (selectedSlot) {
      setTitle("");
      setDescription("");
      setCategory("work");
      setDate(format(selectedSlot.date, "yyyy-MM-dd"));
      setStartTime(format(new Date(selectedSlot.startTime), "HH:mm"));
      setEndTime(format(new Date(selectedSlot.endTime), "HH:mm"));
    }
    setErrors({});
  };

  useEffect(() => {
    resetForm();
  }, [event, selectedSlot, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required";
    }

    // Check if end time is after start time
    if (startTime && endTime) {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      if (isAfter(start, end)) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        title,
        category,
        description,
        date: new Date(date).toISOString(),
        startTime: new Date(`${date}T${startTime}`).toISOString(),
        endTime: new Date(`${date}T${endTime}`).toISOString(),
      };

      if (event) {
        await dispatch(updateEvent({ id: event._id, ...eventData }));
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully",
        });
      } else {
        await dispatch(createEvent(eventData));
        toast({
          title: "Event created",
          description: "Your event has been created successfully",
        });
      }

      await dispatch(fetchEvents());

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    console.log(event);

    setIsSubmitting(true);

    try {
      await dispatch(deleteEvent(event.id as string));
      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully",
      });
      dispatch(fetchEvents());
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (value: string) => {
    return CATEGORIES.find((cat) => cat.value === value)?.icon || "🏷️";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-blue-500 mr-2">{event ? "✏️" : "➕"}</span>
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center">
              <span className="text-gray-500 mr-2">📌</span>
              Title
            </Label>
            <Input
              id="title"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center">
              <span className="text-gray-500 mr-2">
                <Tag className="h-4 w-4" />
              </span>
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category">
                  <span className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {CATEGORIES.find((cat) => cat.value === category)?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="flex items-center"
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center">
              <span className="text-gray-500 mr-2">📝</span>
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add event details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <span className="text-gray-500 mr-2">
                <Calendar className="h-4 w-4" />
              </span>
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center">
                <span className="text-gray-500 mr-2">
                  <Clock className="h-4 w-4" />
                </span>
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={errors.startTime ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center">
                <span className="text-gray-500 mr-2">
                  <Clock className="h-4 w-4" />
                </span>
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={errors.endTime ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {event && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : event
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
