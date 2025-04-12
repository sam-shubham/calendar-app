export interface Event {
  _id: string
  title: string
  category: string
  date: string
  startTime: string
  endTime: string
}

export interface Goal {
  _id: string
  name: string
  color: string
}

export interface Task {
  _id: string
  name: string
  goalId: string
}
