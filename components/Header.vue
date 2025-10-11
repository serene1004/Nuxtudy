<template>
<header class="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
  <div class="mx-auto max-w-[1440px] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <h1 class="font-bold text-neutral-700 dark:text-neutral-100 text-2xl sm:text-3xl">Nuxtudy</h1>

    <nav class="flex items-center gap-2">
      <NuxtLink
        to="/"
        :class="[baseLinkClass, linkClass('/')]"
      >
        <UIcon name="i-lucide-home" class="h-4 w-4" aria-hidden="true" />
        <span>Home</span>
      </NuxtLink>

      <NuxtLink
        to="/guestbook"
        :class="[baseLinkClass, linkClass('/guestbook')]"
      >
        <UIcon name="i-lucide-book-heart" class="h-4 w-4" aria-hidden="true" />
        <span>GuestBook</span>
      </NuxtLink>

      <NuxtLink
        to="/about"
        :class="[baseLinkClass, linkClass('/about')]"
      >
        <UIcon name="i-lucide-smile" class="h-4 w-4" aria-hidden="true" />
        <span>About</span>
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-2">
      <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        variant="ghost"
        color="neutral"
        :aria-label="isDark ? 'Switch to light' : 'Switch to dark'"
        @click="toggleColorMode"
      />
      <UButton
        icon="i-lucide-github"
        variant="ghost"
        color="neutral"
        aria-label="Open GitHub"
        @click="visitGithub"
      />
    </div>
  </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const visitGithub = () => {
  window.open('https://serene1004.github.io/', '_blank', 'noopener')
}

const baseLinkClass = 'inline-flex items-center px-4 py-2 gap-2 text-sm transition-colors'

const linkClass = (path: string) => {
  const active = route.path === path
  return active
    ? 'text-primary-600 dark:text-primary-400 hover:text-primary-600 hover:dark:text-primary-400'
    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 hover:dark:text-neutral-50'
}
</script>