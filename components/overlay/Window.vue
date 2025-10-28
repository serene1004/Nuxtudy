<template>
  <teleport to='body'>
    <div
      v-if="visible"
      class="absolute min-w-[320px] max-w-[25vw] p-1 bg-purple-200 dark:bg-purple-700 border border-purple-200"
      :style="panelStyle"
    >
      <div
        class="flex items-center justify-between gap-2 pb-2 select-none"
        @pointerdown="isDraggable ? onDragStart($event) : undefined"
      >
        <div class="flex items-center">
          <UIcon name="i-lucide-smile" class="h-6 w-6 mr-2" aria-hidden="true" />
          <h3 class="text-base font-semibold truncate">{{ title }}</h3>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center w-6 h-6 border-2 border-purple-200 border-b-purple-900 border-r-purple-900 bg-purple-700 cursor-pointer"
          aria-label="Close"
          @click="close()"
        >
          <UIcon name="i-lucide-x" class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div class="p-2 bg-purple-200 text-slate-800 text-sm">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  visible?: boolean
  title?: string | null
  draggable?: boolean
}>(), {
  visible: false,
  title: null,
  draggable: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'close': []
}>()

const visible = computed({
  get: () => props.visible,
  set: v => emit('update:visible', v)
})

const offsetX = ref(0)
const offsetY = ref(0)
const panelStyle = computed(() => ({
  transform: `translate(calc(-50% + ${offsetX.value}px), calc(-50% + ${offsetY.value}px))`,
  left: '50%',
  top: '50%'
}))

const isDraggable = computed(() => props.draggable)
let dragging = false
let originX = 0
let originY = 0

const onDragStart = (e: PointerEvent) => {
  if (!isDraggable.value) return
  dragging = true
  originX = e.clientX - offsetX.value
  originY = e.clientY - offsetY.value
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd, { once: true })
}

const onDragMove = (e: PointerEvent) => {
  if (!dragging) return
  offsetX.value = e.clientX - originX
  offsetY.value = e.clientY - originY
}

const onDragEnd = () => {
  dragging = false
  window.removeEventListener('pointermove', onDragMove)
}

const close = () => {
  if (!visible.value) return
  visible.value = false
  emit('close')
}
</script>