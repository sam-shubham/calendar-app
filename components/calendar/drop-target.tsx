"use client"

import { useDrop } from "react-dnd"
import { useDispatch } from "react-redux"
import type { Task } from "@/lib/types"
import type { AppDispatch } from "@/lib/redux/store"

interface DropTargetProps {
  date: Date
  time: string
  onEventCreate: (date: Date, startTime: string, endTime: string, task: Task) => void
}

const DropTarget = ({ date, time, onEventCreate }: DropTargetProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      const hour = Number.parseInt(time.split(":")[0])
      const isPM = time.includes("PM") && hour !== 12
      const hour24 = isPM ? hour + 12 : hour === 12 ? 0 : hour

      const startTime = new Date(date)
      startTime.setHours(hour24, 0, 0, 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + 30)

      onEventCreate(date, startTime.toISOString(), endTime.toISOString(), item.task)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return <div ref={drop} className={`absolute inset-0 ${isOver ? "bg-blue-100 opacity-50" : ""}`} />
}

export default DropTarget
