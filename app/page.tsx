"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"
import Calendar from "@/components/calendar/calendar"

export default function Home() {
  return (
    <Provider store={store}>
      <main className="min-h-screen bg-white">
        <Calendar />
      </main>
    </Provider>
  )
}
