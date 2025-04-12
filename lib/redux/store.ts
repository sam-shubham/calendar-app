import { configureStore } from "@reduxjs/toolkit"
import eventReducer from "./slices/eventSlice"
import taskReducer from "./slices/taskSlice"

export const store = configureStore({
  reducer: {
    events: eventReducer,
    tasks: taskReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
