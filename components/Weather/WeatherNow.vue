<template>
  <div class="w-full max-w-[192px] min-w-0 h-[164px] shrink-0 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
    <div class="flex items-center justify-between pb-1">
      <h3 class="font-semibold">현재 날씨</h3>

      <UButton
        :icon="pending ? 'i-lucide-loader-circle' : 'i-lucide-refresh-ccw'"
        :loading="pending"
        size="xs"
        variant="ghost"
        color="neutral"
        :aria-busy="pending ? 'true' : 'false'"
        aria-label="새로고침"
        @click="handleRefresh"
      />
    </div>

    <div v-if="pending" class="text-sm text-neutral-500">
      불러오는 중…
    </div>

    <div v-else-if="error" class="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
      <UIcon name="i-lucide-alert-triangle" class="h-4 w-4 shrink-0" aria-hidden="true" />
      데이터를 불러오지 못했습니다.
    </div>

    <ul v-else class="space-y-0.5">
      <li v-for="item in items" :key="item.key" :class="liClass">
        <UIcon :name="item.icon" :class="iconClass" aria-hidden="true" />
        <span :class="textClass">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ lat?: number; lon?: number; title?: string }>()
const { current, pending, error, refresh } = useWeather(props.lat, props.lon)

type WmoInfo = { text: string; icon: string }
const wmoInfo = (code?: number, isDay?: number | boolean): WmoInfo => {
  const day = typeof isDay === 'boolean' ? isDay : isDay === 1

  if (code == null) return { text: '정보 없음', icon: 'i-lucide-cloud' }
  if (code === 0) {
    return { text: '맑음', icon: day ? 'i-lucide-sun' : 'i-lucide-moon' }
  }
  if ([1, 2, 3].includes(code)) {
    return { text: '구름 조금', icon: day ? 'i-lucide-cloud-sun' : 'i-lucide-cloud-moon' }
  }
  if ([45, 48].includes(code)) {
    return { text: '안개', icon: 'i-lucide-fog' }
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { text: '이슬비', icon: 'i-lucide-cloud-drizzle' }
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { text: '비', icon: 'i-lucide-cloud-rain' }
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: '눈', icon: 'i-lucide-cloud-snow' }
  }
  if ([95, 96, 99].includes(code)) {
    return { text: '뇌우', icon: 'i-lucide-cloud-lightning' }
  }
  return { text: `코드 ${code}`, icon: 'i-lucide-cloud' }
}
const status = computed(() => wmoInfo(current.value?.weathercode, (current as any).value?.is_day))

const handleRefresh = () => refresh()

const liClass = 'flex items-center py-0.5 text-sm '
const iconClass = 'shrink-0 h-4 w-4 me-2 text-neutral-900 dark:text-neutral-100'
const textClass = 'truncate text-neutral-900 dark:text-neutral-100'

const items = computed(() => {
  const temp = Math.round(current.value?.temperature ?? 0) + '°'
  const s = status.value
  const wind = '풍속 ' + Math.round(current.value?.windspeed ?? 0) + ' m/s'
  const date = `${current.value?.date ?? ''} ${current.value?.time ?? ''}`.trim()

  return [
    { key: 'temp', icon: 'i-lucide-thermometer', text: temp },
    { key: 'status', icon: s.icon, text: s.text },
    { key: 'wind', icon: 'i-lucide-wind', text: wind },
    { key: 'date', icon: 'i-lucide-calendar-clock', text: date }
  ]
})
</script>