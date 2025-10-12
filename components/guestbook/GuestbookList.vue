<template>
  <div class="flex flex-col p-4 gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-book-heart" class="h-6 w-6" />
      <h3 class="text-base font-semibold">방명록 목록</h3>
      <span class="text-sm text-neutral-500">({{ entries.length }})</span>
    </div>

    <div v-if="pending" class="py-6 text-sm text-neutral-500">불러오는 중…</div>
    <div v-else-if="entries.length === 0" class="py-8 text-center text-sm text-neutral-500">아직 방명록이 없어요.</div>

    <ul v-else class="space-y-2">
      <li v-for="e in entries" :key="e.id" class="flex flex-col py-2 gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="h-6 w-6" />
          <p class="text-sm truncate">{{ e.name }}</p>
          <p class="text-xs text-neutral-500">{{ fmt(e.createdAt) }}</p>
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            size="xs"
            color="neutral"
            :loading="deletingId === e.id"
            class="ml-auto"
            @click="handleDelete(e)"
          />
        </div>
        <p class="pl-8 text-sm whitespace-pre-wrap break-words">{{ e.message }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGuestbook } from '@/composables/useGuestbook'

const { entries, pending, fetchEntries, deleteEntry } = useGuestbook()
const deletingId = ref<string | null>(null)

const fmt = (iso: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const handleDelete = async (item: GuestbookItem) => {
  if (!confirm(`삭제하시겠습니까?`)) return

  const inputPw = prompt('패스워드를 입력하세요.')
  if (inputPw == null) return

  const pw = inputPw.trim()
  if (!/^\d{4}$/.test(pw)) {
    alert('패스워드는 숫자 4자리여야 합니다.')
    return
  }

  deletingId.value = item.id
  try {
    await deleteEntry(item.id, { name: item.name, password: pw })
  } catch (e: any) {
    const status =
      e?.statusCode ??
      e?.response?.status ??
      e?.data?.statusCode ??
      e?.response?._data?.statusCode

    const statusMessage =
      e?.data?.statusMessage ??
      e?.response?._data?.statusMessage ??
      e?.statusMessage ??
      e?.message

    if (status === 403) {
      alert(statusMessage || '이름 또는 패스워드가 일치하지 않습니다.')
    } else {
      alert(statusMessage || '삭제에 실패했어요. 잠시 후 다시 시도해 주세요.')
    }
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchEntries)
</script>