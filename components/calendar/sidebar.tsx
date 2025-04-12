"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useDrag } from "react-dnd"
import { Home } from "lucide-react"
import type { RootState } from "@/lib/redux/store"
import type { Goal, Task } from "@/lib/types"

const Sidebar = () => {
  const goals = useSelector((state: RootState) => state.tasks.goals)
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId)
  }

  const filteredTasks = selectedGoal ? tasks.filter((task) => task.goalId === selectedGoal) : []

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col h-full overflow-auto">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold text-gray-500">GOALS</h2>
        <div className="mt-2 space-y-2">
          {goals.map((goal) => (
            <GoalItem
              key={goal._id}
              goal={goal}
              isSelected={selectedGoal === goal._id}
              onClick={() => handleGoalClick(goal._id)}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex-1">
        <h2 className="text-sm font-semibold text-gray-500">TASKS</h2>
        <div className="mt-2 space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
          {selectedGoal === null && <div className="text-sm text-gray-400 italic">Select a goal to see tasks</div>}
          {selectedGoal !== null && filteredTasks.length === 0 && (
            <div className="text-sm text-gray-400 italic">No tasks for this goal</div>
          )}
        </div>
      </div>
    </div>
  )
}

interface GoalItemProps {
  goal: Goal
  isSelected: boolean
  onClick: () => void
}

const GoalItem = ({ goal, isSelected, onClick }: GoalItemProps) => {
  return (
    <div
      className={`flex items-center p-2 rounded cursor-pointer ${isSelected ? "bg-gray-200" : "hover:bg-gray-100"}`}
      onClick={onClick}
    >
      <Home className="h-4 w-4 mr-2 text-gray-500" />
      <span className="text-sm">{goal.name}</span>
    </div>
  )
}

interface TaskItemProps {
  task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task._id, task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getTaskColor = (goalId: string) => {
    // This should match the goal's color
    const colorMap: Record<string, string> = {
      goal1: "bg-blue-100",
      goal2: "bg-green-100",
      goal3: "bg-purple-100",
      goal4: "bg-yellow-100",
    }

    return colorMap[goalId] || "bg-gray-100"
  }

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded cursor-move ${getTaskColor(
        task.goalId,
      )} ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Home className="h-4 w-4 mr-2 text-gray-500" />
      <span className="text-sm">{task.name}</span>
    </div>
  )
}

export default Sidebar
