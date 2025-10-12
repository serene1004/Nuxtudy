<template>
  <div class="flex flex-col p-4 gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-notebook-pen" class="h-6 w-6" />
      <h3 class="text-base font-semibold">방명록 작성</h3>
    </div>

    <div class="flex flex-col md:flex-row md:items-end w-full gap-4">
      <UFormField
        name="name"
        label="이름"
        class="basis-full md:basis-1/6 min-w-0"
      >
        <UInput
          v-model="name"
          maxlength="10"
          placeholder="이름"
          required
          size="sm"
          class="w-full"
        />
      </UFormField>
  
      <UFormField
        name="password"
        label="패스워드"
        class="basis-full md:basis-1/6 min-w-0"
      >
        <UInput
          v-model="password"
          type="password"
          maxlength="4"
          inputmode="numeric"
          pattern="[0-9]{4}"
          placeholder="* * * *"
          required
          size="sm"
          class="w-full"
        />
      </UFormField>
  
      <UFormField
        name="message"
        label="메시지"
        class="basis-full md:basis-4/6 min-w-0"
      >
        <UInput
          v-model="message"
          maxlength="50"
          placeholder="하고싶은말(최대50자)"
          required
          size="sm"
          class="w-full"
        />
      </UFormField>
  
      <div class="md:ml-auto shrink-0">
        <UButton
          type="submit"
          icon="i-lucide-send"
          label="등록"
          color="primary"
          size="sm"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>

  <UAlert
    v-if="error"
    color="error"
    variant="soft"
    title="오류가 발생했어요."
    description="다시 시도해 주세요."
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGuestbook } from '@/composables/useGuestbook'

const { error, addEntry } = useGuestbook()

const name = ref('')
const password = ref('')
const message = ref('')
const submitting = ref(false)

const canSubmit = computed(() =>
  name.value.trim().length > 0 &&
  name.value.trim().length <= 10 &&
  /^\d{4}$/.test(password.value.trim()) &&
  message.value.trim().length > 0 &&
  message.value.trim().length <= 50 &&
  !submitting.value
)

const handleSubmit = async () => {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await addEntry({ name: name.value.trim(), password: password.value.trim(), message: message.value.trim() })
    name.value = ''
    password.value = ''
    message.value = ''
  } finally {
    submitting.value = false
  }
}
</script>