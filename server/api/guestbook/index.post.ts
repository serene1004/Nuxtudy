type GuestbookEntry = {
  id: string
  name: string
  message: string
  createdAt: string
  password: string
}

const STORAGE_KEY = 'entries'
const sanitize = (v?: string) => (typeof v === 'string' ? v.trim() : '')

export default defineEventHandler(async (event) => {
  const storage = useStorage('data:guestbook')
  const body = await readBody<{ name?: string, message?: string, password?: string }>(event)

  const name = sanitize(body?.name)
  const message = sanitize(body?.message)
  const password = sanitize(body?.password)

  if (!name || !message || !password) {
    throw createError({ statusCode: 400, statusMessage: '이름, 패스워드, 메시지는 필수입니다.' })
  }
  if (name.length > 10) {
    throw createError({ statusCode: 400, statusMessage: '이름은 10자 이하여야 합니다.' })
  }
  if (message.length > 50) {
    throw createError({ statusCode: 400, statusMessage: '메시지는 50자 이하여야 합니다.' })
  }
  if (!/^\d{4}$/.test(password)) {
    throw createError({ statusCode: 400, statusMessage: '패스워드는 숫자 4자리여야 합니다.' })
  }

  const entries = (await storage.getItem<GuestbookEntry[]>(STORAGE_KEY)) || []
  const newEntry: GuestbookEntry = {
    id: crypto.randomUUID(),
    name,
    message,
    createdAt: new Date().toISOString(),
    password
  }

  entries.push(newEntry)
  await storage.setItem(STORAGE_KEY, entries)

  const { password: _pw, ...safe } = newEntry
  return safe
})
