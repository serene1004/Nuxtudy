export type GuestbookItem = {
  id: string
  name: string
  message: string
  createdAt: string
}

type CreatePayload = { name: string, message: string, password: string }
type DeleteCreds   = { name: string, password: string }

export const useGuestbook = () => {
  const entries = useState<GuestbookItem[]>('guestbook:entries', () => [])
  const pending = useState<boolean>('guestbook:pending', () => false)
  const error   = useState<unknown>('guestbook:error', () => null)

  const fetchEntries = async () => {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<GuestbookItem[]>('/api/guestbook')
      entries.value = data
    } catch (e) {
      error.value = e
    } finally {
      pending.value = false
    }
  }

  const addEntry = async (payload: CreatePayload) => {
    error.value = null
    await $fetch('/api/guestbook', { method: 'POST', body: payload })
    await fetchEntries()
  }

  const deleteEntry = async (id: string, creds: DeleteCreds) => {
    error.value = null
    await $fetch(`/api/guestbook/${id}`, { method: 'DELETE', body: creds })
    await fetchEntries()
  }

  return { entries, pending, error, fetchEntries, addEntry, deleteEntry }
}