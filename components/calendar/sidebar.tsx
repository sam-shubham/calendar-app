"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDrag } from "react-dnd";
import { Home, Plus, Tag, CheckCircle, Trash2 } from "lucide-react";
import type { RootState } from "@/lib/redux/store";
import type { AppDispatch } from "@/lib/redux/store";
import type { Goal, Task } from "@/lib/types";
import {
  fetchGoals,
  fetchTasks,
  createGoal,
  createTask,
  removeGoal,
  removeTask,
  toggleTaskComplete,
} from "@/lib/redux/slices/taskSlice";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const goals = useSelector((state: RootState) => state.tasks.goals);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // Fetch goals and tasks on component mount
  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId);
  };

  const handleAddGoal = () => {
    if (newGoalName.trim() === "") return;

    const newGoal: Omit<Goal, "id"> = {
      name: newGoalName,
      color: getRandomColor(),
    };

    dispatch(createGoal(newGoal));
    setNewGoalName("");
    setIsAddingGoal(false);
  };

  const handleAddTask = () => {
    if (newTaskName.trim() === "" || !selectedGoal) return;

    // Log for debugging
    console.log("Creating task:", {
      name: newTaskName,
      goalId: selectedGoal,
    });

    const newTask: Omit<Task, "id"> = {
      name: newTaskName,
      goalId: selectedGoal,
      completed: false,
      description: "",
    };

    dispatch(createTask(newTask));
    setNewTaskName("");
    setIsAddingTask(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    dispatch(removeGoal(goalId));
    if (selectedGoal === goalId) {
      setSelectedGoal(null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(removeTask(taskId));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    dispatch(toggleTaskComplete(taskId));
  };

  const getRandomColor = () => {
    const colors = ["blue", "green", "purple", "yellow", "pink", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredTasks = selectedGoal
    ? tasks.filter((task) => task.goalId === selectedGoal)
    : [];

  // Check for error
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
      // You could add a toast notification or error display here
    }
  }, [error]);

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col h-full overflow-auto">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-500">GOALS</h2>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {isAddingGoal && (
          <div className="mb-3 flex">
            <input
              type="text"
              className="flex-1 text-sm border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Goal name"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              autoFocus
            />
            <button
              className="px-2 bg-blue-500 text-white rounded-r text-sm hover:bg-blue-600"
              onClick={handleAddGoal}
            >
              Add
            </button>
          </div>
        )}

        <div className="mt-2 space-y-2">
          {loading && goals.length === 0 ? (
            <div className="text-sm text-gray-400">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-sm text-gray-400 italic">
              No goals yet. Create one!
            </div>
          ) : (
            goals.map((goal) => (
              <GoalItem
                key={Math.random()} // Use the actual id, not Math.random()
                goal={goal}
                isSelected={
                  selectedGoal === goal.id || selectedGoal === goal.id
                }
                onClick={() => handleGoalClick(goal.id || goal.id)}
                onDelete={() => handleDeleteGoal(goal.id || goal.id)}
              />
            ))
          )}
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-500">TASKS</h2>
          {selectedGoal && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-600" />
              {/* {selectedGoal} */}
            </button>
          )}
        </div>

        {isAddingTask && selectedGoal && (
          <div className="mb-3 flex">
            <input
              type="text"
              className="flex-1 text-sm border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              autoFocus
            />
            <button
              className="px-2 bg-blue-500 text-white rounded-r text-sm hover:bg-blue-600"
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
        )}

        <div className="mt-2 space-y-2">
          {loading && tasks.length === 0 ? (
            <div className="text-sm text-gray-400">Loading tasks...</div>
          ) : selectedGoal === null ? (
            <div className="text-sm text-gray-400 italic">
              Select a goal to see tasks
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-sm text-gray-400 italic">
              No tasks for this goal. Add one!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={Math.random()}
                task={task}
                onDelete={() => handleDeleteTask(task.id || task.id)}
                onToggleComplete={() =>
                  handleToggleTaskComplete(task.id || task.id)
                }
              />
            ))
          )}
        </div>
      </div>

      {/* Debug info - remove in production */}
      {error && (
        <div className="p-2 text-xs bg-red-50 text-red-600 border-t">
          Error: {error}
        </div>
      )}
    </div>
  );
};

interface GoalItemProps {
  goal: Goal;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const GoalItem = ({ goal, isSelected, onClick, onDelete }: GoalItemProps) => {
  const getGoalIcon = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      yellow: "text-yellow-500",
      pink: "text-pink-500",
      orange: "text-orange-500",
    };

    return (
      <Tag className={`h-4 w-4 mr-2 ${colorMap[color] || "text-gray-500"}`} />
    );
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded cursor-pointer group ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {getGoalIcon(goal.color)}
        <span className="text-sm">{goal.name}</span>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete goal"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const TaskItem = ({ task, onDelete, onToggleComplete }: TaskItemProps) => {
  const goals = useSelector((state: RootState) => state.tasks.goals);
  const goal = goals.find((g) => g.id === task.goalId);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getTaskColor = (goalColor?: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 border-blue-200",
      green: "bg-green-100 border-green-200",
      purple: "bg-purple-100 border-purple-200",
      yellow: "bg-yellow-100 border-yellow-200",
      pink: "bg-pink-100 border-pink-200",
      orange: "bg-orange-100 border-orange-200",
    };

    return colorMap[goalColor || ""] || "bg-gray-100 border-gray-200";
  };

  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className={`flex items-center justify-between p-2 rounded cursor-move border ${getTaskColor(
        goal?.color
      )} 
        ${isDragging ? "opacity-50" : "opacity-100"} 
        ${task.completed ? "bg-opacity-50 line-through text-gray-500" : ""} 
        group`}
    >
      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className={`h-4 w-4 rounded-full border mr-2 flex items-center justify-center
            ${
              task.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-400"
            }`}
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
        </button>
        <span className="text-sm">{task.name}</span>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
