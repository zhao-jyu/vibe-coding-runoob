import { reactive, watch } from 'vue'
import { loadTasks, saveTasks } from '../utils/storage'
import type { Task, TaskPriority, TaskStatus } from '../types/task'

interface NewTaskData {
  title: string
  description: string
  priority: TaskPriority
}

const exampleTasks: Task[] = [
  {
    id: 1,
    title: '梳理产品需求文档',
    description: '整理本周访谈内容，明确第一版任务管理流程。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '今天',
    createdAt: '2026-09-12',
  },
  {
    id: 2,
    title: '设计任务卡片组件',
    description: '完成卡片信息层级、优先级标签和响应式状态。',
    status: 'todo',
    priority: 'medium',
    dueDate: '明天',
    createdAt: '2026-09-13',
  },
  {
    id: 3,
    title: '准备项目演示',
    description: '检查演示流程并准备一组可复用的示例数据。',
    status: 'done',
    priority: 'low',
    dueDate: '9月14日',
    createdAt: '2026-09-10',
  },
]

const storedTasks = loadTasks()
export const tasks = reactive<Task[]>(storedTasks.length > 0 ? storedTasks : exampleTasks)

watch(tasks, (currentTasks) => {
  saveTasks(currentTasks)
}, { deep: true, immediate: true })

export function addTask(taskData: NewTaskData): void {
  tasks.push({
    id: Date.now(),
    ...taskData,
    status: 'todo',
    dueDate: '未设置',
    createdAt: new Date().toISOString(),
  })
}

export function updateTask(taskId: number, updates: Partial<Omit<Task, 'id'>>): void {
  const task = tasks.find((item) => item.id === taskId)
  if (task) Object.assign(task, updates)
}

export function deleteTask(taskId: number): void {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) tasks.splice(taskIndex, 1)
}

export function toggleTask(taskId: number): void {
  const task = tasks.find((item) => item.id === taskId)
  if (task) {
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    updateTask(taskId, { status: nextStatus })
  }
}
