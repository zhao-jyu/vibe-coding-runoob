<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

defineEmits<{
  toggle: []
  delete: []
}>()
</script>

<template>
  <article
    class="group rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950/30"
    :class="{
      'border-l-rose-500': task.priority === 'high',
      'border-l-amber-400': task.priority === 'medium',
      'border-l-emerald-500': task.priority === 'low',
    }"
  >
    <div class="flex items-start gap-3">
      <button
        class="-ml-2 -mt-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :class="task.status === 'done' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600'"
        type="button"
        :aria-label="task.status === 'done' ? '标记为未完成' : '标记为完成'"
        @click="$emit('toggle')"
      >
        <span v-if="task.status === 'done'" class="text-xs leading-none">✓</span>
      </button>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <h3
            class="text-lg font-semibold text-slate-900 transition dark:text-slate-100"
            :class="task.status === 'done' ? 'text-slate-400 line-through dark:text-slate-500' : ''"
          >
            {{ task.title }}
          </h3>
          <button
            class="-mr-2 -mt-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded p-1 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            type="button"
            aria-label="删除任务"
            @click="$emit('delete')"
          >
            ×
          </button>
        </div>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ task.description }}</p>
        <div class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-700">
          <span
            class="font-medium"
            :class="{
              'text-rose-600': task.priority === 'high',
              'text-amber-600': task.priority === 'medium',
              'text-emerald-600': task.priority === 'low',
            }"
          >
            {{ task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级' }}
          </span>
          <span class="text-slate-400 dark:text-slate-500">截止 {{ task.dueDate }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
