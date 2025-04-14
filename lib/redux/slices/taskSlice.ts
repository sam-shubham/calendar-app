import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Goal, Task } from "@/lib/types";

interface TaskState {
  goals: Goal[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  goals: [],
  tasks: [],
  loading: false,
  error: null,
};

// Fetch initial data
export const fetchGoals = createAsyncThunk(
  "tasks/fetchGoals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/goals");
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create new goal
export const createGoal = createAsyncThunk(
  "tasks/createGoal",
  async (goalData: Omit<Goal, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Omit<Task, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete a goal
export const removeGoal = createAsyncThunk(
  "tasks/removeGoal",
  async (goalId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      return goalId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete a task
export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return taskId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Simple actions for client-side-only operations (no API calls)
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload);
    },

    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      // Also delete associated tasks
      state.tasks = state.tasks.filter(
        (task) => task.goalId !== action.payload
      );
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create goal
      .addCase(createGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.goals.push(action.payload);
        state.loading = false;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Create task
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Delete goal
      .addCase(removeGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
        state.tasks = state.tasks.filter(
          (task) => task.goalId !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeGoal.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Delete task
      .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { addGoal, addTask, deleteGoal, deleteTask, toggleTaskComplete } =
  taskSlice.actions;
export default taskSlice.reducer;
