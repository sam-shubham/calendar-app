import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Event } from "@/lib/types"

interface EventState {
  events: Event[]
  loading: boolean
  error: string | null
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
}

export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/events")
    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }
    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData: Omit<Event, "_id">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
      if (!response.ok) {
        throw new Error("Failed to create event")
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, ...eventData }: { id: string } & Omit<Event, "_id">, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
      if (!response.ok) {
        throw new Error("Failed to update event")
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete event")
    }
    return id
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false
        const index = state.events.findIndex((e) => e._id === action.payload._id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.events = state.events.filter((e) => e._id !== action.payload)
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default eventSlice.reducer
