<script setup lang="ts">
import { onMounted, ref } from 'vue'

const THEME_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

function toggleTheme() {
  const nextThemeIsDark = !isDark.value
  applyTheme(nextThemeIsDark)
  localStorage.setItem(THEME_KEY, nextThemeIsDark ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark)
})
</script>

<template>
  <button
    class="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-slate-700 dark:hover:text-indigo-300 dark:focus:ring-offset-slate-900"
    type="button"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
  </button>
</template>
