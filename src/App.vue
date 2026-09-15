<script setup>
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, tasks, toggleTask, updateTask } from './stores/taskStore'

const isModalOpen = ref(false)
const isMenuOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const completedCount = computed(() => tasks.filter((task) => task.status === 'done').length)

function changeTaskStatus(taskId, status) {
  updateTask(taskId, { status })
}

function switchView(view) {
  activeView.value = view
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
        <div class="flex items-center gap-3"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-200">VC</div><h1 class="text-lg font-semibold tracking-tight">Vibe Coding Runoob</h1></div>
        <div class="flex items-center gap-2"><div class="hidden items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>本周进度 {{ completedCount }}/{{ tasks.length }}</div><ThemeToggle /><button class="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden" type="button" :aria-expanded="isMenuOpen" aria-label="打开导航菜单" @click="toggleMenu"><span class="text-2xl leading-none">{{ isMenuOpen ? '×' : '☰' }}</span></button></div>
      </div>
      <div v-if="isMenuOpen" class="border-t border-slate-200 px-5 py-3 dark:border-slate-800 sm:hidden"><div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>本周进度 {{ completedCount }}/{{ tasks.length }}</div></div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <section class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p class="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">任务空间</p><h2 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">把想法变成进度</h2><p class="mt-3 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">集中查看当前任务，保持节奏，让每一个小目标都清晰可见。</p></div>
        <button class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="button" @click="isModalOpen = true"><span class="text-lg leading-none">+</span>新建任务</button>
      </section>

      <div class="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <button
          class="min-h-11 rounded-md px-4 py-2 text-sm font-medium transition"
          :class="activeView === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          type="button"
          @click="switchView('list')"
        >
          列表
        </button>
        <button
          class="min-h-11 rounded-md px-4 py-2 text-sm font-medium transition"
          :class="activeView === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          type="button"
          @click="switchView('kanban')"
        >
          看板
        </button>
      </div>

      <TaskList
        v-if="activeView === 'list'"
        :tasks="tasks"
        @toggle="toggleTask($event.id)"
        @delete="deleteTask($event.id)"
      />
      <KanbanBoard
        v-else
        :tasks="tasks"
        @toggle="toggleTask($event.id)"
        @delete="deleteTask($event.id)"
        @status-change="changeTaskStatus"
      />
    </main>

    <TaskModal v-model="isModalOpen" @submit="addTask" />
  </div>
</template>
