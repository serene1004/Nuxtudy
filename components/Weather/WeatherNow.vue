<script setup lang="ts">
const props = defineProps<{ lat?: number; lon?: number; title?: string }>()
const { current, pending, error, refresh } = useWeather(props.lat, props.lon)

const wmoText = (code?: number) => {
  if (code == null) return '정보 없음'
  if (code === 0) return '맑음'
  if ([1,2,3].includes(code)) return '구름 조금'
  if ([45,48].includes(code)) return '안개'
  if ([51,53,55,56,57].includes(code)) return '이슬비'
  if ([61,63,65,66,67].includes(code)) return '비'
  if ([71,73,75,77].includes(code)) return '눈'
  if ([80,81,82].includes(code)) return '소나기'
  if ([95,96,99].includes(code)) return '뇌우'
  return `코드 ${code}`
}

const handleRefresh = () => refresh()
</script>

<template>
  <div
    class="data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden focus:outline-none hidden lg:flex relative"
    data-state="open"
  >
    <div
      class="absolute ms-2.5 transition-[translate,height] duration-200 h-(--indicator-size) translate-y-(--indicator-position) w-px bg-primary"
      style="--indicator-size: 32px; --indicator-position: 0px;"
      aria-hidden="true"
    />

    <div class="min-w-0 ms-2.5 ps-4 border-s border-default w-full">
      <div class="flex items-center justify-between py-1">
        <h3 class="font-medium text-default">현재 날씨</h3>

        <UButton
          :icon="pending ? 'i-lucide-loader-circle' : 'i-lucide-refresh-ccw'"
          :loading="pending"
          variant="link"
          size="xs"
          color="neutral"
          :aria-busy="pending ? 'true' : 'false'"
          aria-label="새로고침"
          @click="handleRefresh"
        />
      </div>

      <div class="py-1">
        <div v-if="pending" class="text-sm text-neutral-500">
          불러오는 중…
        </div>

        <div v-else-if="error" class="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <UIcon name="i-lucide-alert-triangle" class="h-4 w-4" aria-hidden="true" />
          데이터를 불러오지 못했습니다
        </div>

        <ul v-else class="space-y-0.5">
          <li class="text-sm flex items-center py-0.5">
            <UIcon name="i-lucide-thermometer" class="h-4 w-4 me-2 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
            <span class="truncate text-neutral-900 dark:text-neutral-100">
              {{ Math.round(current.temperature ?? 0) }}°
            </span>
          </li>

          <li class="text-sm flex items-center py-0.5">
            <UIcon name="i-lucide-cloud-sun" class="h-4 w-4 me-2 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
            <span class="truncate text-neutral-900 dark:text-neutral-100">
              {{ wmoText(current.weathercode) }}
            </span>
          </li>

          <li class="text-sm flex items-center py-0.5">
            <UIcon name="i-lucide-wind" class="h-4 w-4 me-2 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
            <span class="truncate text-neutral-900 dark:text-neutral-100">
              풍속 {{ Math.round(current.windspeed ?? 0) }} m/s
            </span>
          </li>

          <li class="text-sm flex items-center py-0.5">
            <UIcon name="i-lucide-calendar-clock" class="h-4 w-4 me-2 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
            <span class="truncate text-neutral-900 dark:text-neutral-100">
              {{ current.date }} {{ current.time }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
