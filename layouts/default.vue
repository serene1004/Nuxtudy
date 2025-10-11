<template>
  <Header />
  <main class="mx-auto max-w-[1440px] p-4 sm:px-6 lg:px-8">
    <div class="flex gap-4">
      <div class="flex-1 min-w-0">
        <slot />
      </div>

      <WeatherNow />
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'

const appConfig = useAppConfig()

useHead({
  title: appConfig.title
})
</script>