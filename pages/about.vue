<template>
  <div>About Me</div>

  <UButton
    label="window style modal"
    color="neutral"
    class="cursor-pointer"
    @click="showWindowModal"
  />
  <Window
    v-model:visible="isShowWindowModal"
    title="window style modal"
    draggable
  >
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam distinctio qui explicabo quibusdam a, suscipit iure, quod rem vitae esse minus modi ipsam est asperiores, saepe nesciunt consequatur atque adipisci.</p>
  </Window>
</template>

<script lang="ts" setup>
import Window from '~/components/overlay/Window.vue'

const isShowWindowModal = ref(false)
const showWindowModal = () => {
  isShowWindowModal.value = true
}
</script>