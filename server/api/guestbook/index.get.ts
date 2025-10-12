type GuestbookEntry = {
  id: string
  name: string
  message: string
  createdAt: string
  password: string
}

const STORAGE_KEY = 'entries'

export default defineEventHandler(async () => {
  const storage = useStorage('data:guestbook')
  const entries = (await storage.getItem<GuestbookEntry[]>(STORAGE_KEY)) || []

  return entries
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map(({ password, ...rest }) => rest)
})