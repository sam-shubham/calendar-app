import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Goal, Task } from "@/lib/types"

interface TaskState {
  goals: Goal[]
  tasks: Task[]
  loading: boolean
  error: string | null
}

const initialState: TaskState = {
  goals: [],
  tasks: [],
  loading: false,
  error: null,
}

export const fetchGoals = createAsyncThunk("tasks/fetchGoals", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/goals")
    if (!response.ok) {
      throw new Error("Failed to fetch goals")
    }
    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/tasks")
    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }
    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false
        state.goals = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default taskSlice.reducer
