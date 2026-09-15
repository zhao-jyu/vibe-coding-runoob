import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
  }
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (!storedTasks) return []

    const parsedTasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks as Task[] : []
  } catch {
    return []
  }
}
