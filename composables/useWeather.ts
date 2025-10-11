type WeatherNowRaw = {
  temperature?: number
  windspeed?: number
  weathercode?: number
  time?: string
}

type WeatherNowView = {
  temperature?: number
  windspeed?: number
  weathercode?: number
  date: string
  time: string
}

const splitIsoToDateTime = (iso?: string) => {
  if (typeof iso !== 'string') return { date: '', time: '' }
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(iso)
  return m ? { date: m[1], time: m[2] } : { date: '', time: '' }
}

export const useWeather = (
  lat?: number | Ref<number | undefined | null>,
  lon?: number | Ref<number | undefined | null>,
  tz: string = 'auto'
) => {
  const q = computed(() => {
    const _lat = unref(lat)
    const _lon = unref(lon)
    const hasCoord = Number.isFinite(Number(_lat)) && Number.isFinite(Number(_lon))
    return hasCoord ? { lat: Number(_lat), lon: Number(_lon), tz } : {}
  })

  const { data, pending, error, refresh } = useFetch<WeatherNowRaw>('/api/weather', {
    query: q,
    watch: [q]
  })

  const current = computed<WeatherNowView>(() => {
    const raw = data.value
    const { date, time } = splitIsoToDateTime(raw?.time)
    return {
      temperature: raw?.temperature,
      windspeed: raw?.windspeed,
      weathercode: raw?.weathercode,
      date,
      time
    }
  })

  return { data, current, pending, error, refresh }
}
