import { Task } from "../models/task";

const LOCAL_STORAGE_KEY = "to-do-app-tasks"; 

export function saveTaskToLocalStorage(tasks: Task[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

export function getTasksFromLocalStorage(): Task[] {
  const tasks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
}
