<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
  'status-change': [taskId: number, status: TaskStatus]
}>()

const columns: { status: TaskStatus; title: string; accent: string }[] = [
  { status: 'todo', title: '待办', accent: 'bg-slate-400' },
  { status: 'in-progress', title: '进行中', accent: 'bg-indigo-500' },
  { status: 'done', title: '已完成', accent: 'bg-emerald-500' },
]

const draggedTaskId = ref<number | null>(null)
const activeDropStatus = ref<TaskStatus | null>(null)

const tasksByStatus = computed(() => Object.fromEntries(
  columns.map((column) => [
    column.status,
    props.tasks
      .filter((task) => task.status === column.status)
      .slice()
      .sort((firstTask, secondTask) => new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime()),
  ]),
) as Record<TaskStatus, Task[]>)

function handleDragStart(task: Task, event: DragEvent) {
  draggedTaskId.value = task.id
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(task.id))
  }
}

function handleDragEnd() {
  draggedTaskId.value = null
  activeDropStatus.value = null
}

function handleDragOver(status: TaskStatus, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  activeDropStatus.value = status
}

function handleDrop(status: TaskStatus, event: DragEvent) {
  event.preventDefault()
  const taskId = Number(event.dataTransfer?.getData('text/plain'))
  const draggedId = draggedTaskId.value ?? taskId
  const task = props.tasks.find((item) => item.id === draggedId)

  if (task && task.status !== status) emit('status-change', task.id, status)
  handleDragEnd()
}
</script>

<template>
  <section class="grid gap-5 md:grid-cols-3">
    <div
      v-for="column in columns"
      :key="column.status"
      class="min-h-96 rounded-xl border border-slate-200 bg-slate-100/70 p-4 transition dark:border-slate-800 dark:bg-slate-900/70"
      :class="activeDropStatus === column.status ? 'border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-100 dark:bg-indigo-950/40 dark:ring-indigo-900' : ''"
      @dragover="handleDragOver(column.status, $event)"
      @drop="handleDrop(column.status, $event)"
      @dragleave="activeDropStatus = null"
    >
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" :class="column.accent"></span>
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ column.title }}</h3>
        </div>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ tasksByStatus[column.status].length }}</span>
      </div>

      <div class="space-y-4">
        <div
          v-for="task in tasksByStatus[column.status]"
          :key="task.id"
          draggable="true"
          class="cursor-grab transition active:cursor-grabbing"
          :class="draggedTaskId === task.id ? 'opacity-50' : ''"
          @dragstart="handleDragStart(task, $event)"
          @dragend="handleDragEnd"
        >
          <TaskCard
            :task="task"
            @toggle="emit('toggle', task)"
            @delete="emit('delete', task)"
          />
        </div>
      </div>

      <p v-if="tasksByStatus[column.status].length === 0" class="py-10 text-center text-sm text-slate-400 dark:text-slate-500">暂无任务</p>
    </div>
  </section>
</template>
