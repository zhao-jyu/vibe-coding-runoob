<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { TaskPriority } from '../types/task'

interface NewTaskForm {
  title: string
  description: string
  priority: TaskPriority
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [task: NewTaskForm]
}>()

const form = reactive<NewTaskForm>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref(false)

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = false
}

function closeModal() {
  emit('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) closeModal()
}

function handleSubmit() {
  if (!form.title.trim()) {
    titleError.value = true
    return
  }

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
  })
  closeModal()
  resetForm()
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) resetForm()
})

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 sm:items-center sm:px-5 sm:py-8"
      role="presentation"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl shadow-slate-950/20 dark:bg-slate-900 dark:shadow-black/40 sm:rounded-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="task-modal-title" class="text-xl font-semibold text-slate-900 dark:text-white">新建任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">记录一个新的目标，保持进度清晰。</p>
          </div>
          <button
            class="flex min-h-11 min-w-11 items-center justify-center rounded p-1 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            type="button"
            aria-label="关闭弹窗"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-title">标题 <span class="text-rose-500">*</span></label>
            <input
              id="task-title"
              v-model="form.title"
              class="w-full rounded-lg border px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
              :class="titleError ? 'border-rose-400' : 'border-slate-300 dark:border-slate-700'"
              type="text"
              placeholder="例如：完成首页设计"
              @input="titleError = false"
            />
            <p v-if="titleError" class="mt-1.5 text-sm text-rose-600">标题不能为空</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-description">描述</label>
            <textarea
              id="task-description"
              v-model="form.description"
              class="min-h-24 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
              placeholder="补充任务的背景或下一步行动"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-priority">优先级</label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-950"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button class="min-h-11 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" type="button" @click="closeModal">取消</button>
            <button class="min-h-11 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" type="submit">创建任务</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
