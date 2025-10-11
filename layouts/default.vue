<template>
  <Header />
  <main class="mx-auto max-w-[1440px] p-4 sm:px-6 lg:px-8">
    <slot />
  </main>
</template>

<script setup>
import Header from '~/components/Header.vue'
</script>