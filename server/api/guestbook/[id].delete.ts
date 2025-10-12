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
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: '아이디가 필요합니다.' })

  const body = await readBody<{ name?: string, password?: string }>(event)
  const name = sanitize(body?.name)
  const password = sanitize(body?.password)

  if (!/^\d{4}$/.test(password)) {
    throw createError({ statusCode: 400, statusMessage: '패스워드는 숫자 4자리여야 합니다.' })
  }

  const storage = useStorage('data:guestbook')
  const entries = (await storage.getItem<GuestbookEntry[]>(STORAGE_KEY)) || []
  const idx = entries.findIndex(e => e.id === id)

  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: '존재하지 않는 항목입니다.' })
  }

  const target = entries[idx]
  const match = target.name === name && target.password === password
  if (!match) {
    throw createError({ statusCode: 403, statusMessage: '패스워드를 확인하세요.' })
  }

  entries.splice(idx, 1)
  await storage.setItem(STORAGE_KEY, entries)

  return { success: true }
})
