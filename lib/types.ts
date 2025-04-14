export interface Event {
  _id: string;
  id?: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  goalId: string;
  completed?: boolean;
  description?: string;
}
