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
}>()

const activeFilter = ref<'all' | TaskStatus>('all')

const filters: { key: 'all' | TaskStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'todo', label: '待办' },
  { key: 'in-progress', label: '进行中' },
  { key: 'done', label: '完成' },
]

const sortedTasks = computed(() => {
  const visibleTasks = activeFilter.value === 'all'
    ? props.tasks
    : props.tasks.filter((task) => task.status === activeFilter.value)

  return visibleTasks.slice().sort((firstTask, secondTask) =>
    new Date(secondTask.createdAt).getTime() - new Date(firstTask.createdAt).getTime(),
  )
})
</script>

<template>
  <section>
    <div class="mb-6 border-b border-slate-200 dark:border-slate-800">
      <div class="flex gap-6 overflow-x-auto">
        <button
          v-for="filter in filters"
          :key="filter.key"
          class="min-h-11 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition"
          :class="activeFilter === filter.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          type="button"
          @click="activeFilter = filter.key"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="sortedTasks.length > 0" class="grid gap-4 md:grid-cols-2">
      <TaskCard
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task)"
        @delete="emit('delete', task)"
      />
    </div>
    <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      还没有任务，点击下方按钮创建第一个吧
    </div>
  </section>
</template>
