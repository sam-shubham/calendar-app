"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEvent, updateEvent, deleteEvent } from "@/lib/redux/slices/eventSlice"
import type { Event } from "@/lib/types"
import type { AppDispatch } from "@/lib/redux/store"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  selectedSlot: {
    date: Date
    startTime: string
    endTime: string
  } | null
}

const EventModal = ({ isOpen, onClose, event, selectedSlot }: EventModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("work")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setCategory(event.category)
      setDate(format(new Date(event.date), "yyyy-MM-dd"))
      setStartTime(format(new Date(event.startTime), "HH:mm"))
      setEndTime(format(new Date(event.endTime), "HH:mm"))
    } else if (selectedSlot) {
      setTitle("")
      setCategory("work")
      setDate(format(selectedSlot.date, "yyyy-MM-dd"))
      setStartTime(format(new Date(selectedSlot.startTime), "HH:mm"))
      setEndTime(format(new Date(selectedSlot.endTime), "HH:mm"))
    }
  }, [event, selectedSlot])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventData = {
      title,
      category,
      date: new Date(date).toISOString(),
      startTime: new Date(`${date}T${startTime}`).toISOString(),
      endTime: new Date(`${date}T${endTime}`).toISOString(),
    }

    if (event) {
      dispatch(updateEvent({ id: event._id, ...eventData }))
    } else {
      dispatch(createEvent(eventData))
    }

    onClose()
  }

  const handleDelete = () => {
    if (event) {
      dispatch(deleteEvent(event._id))
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-blue-500 mr-2">+</span>
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center">
              <span className="text-gray-500 mr-2">🏷️</span>
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="eating">Eating</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="relax">Relax</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <span className="text-gray-500 mr-2">📅</span>
              Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="flex items-center">
              <span className="text-gray-500 mr-2">🕒</span>
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime" className="flex items-center">
              <span className="text-gray-500 mr-2">🕓</span>
              End Time
            </Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {event && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
