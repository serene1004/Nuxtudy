export default defineEventHandler(async (event) => {
  const { lat='37.566', lon='126.9784', tz = 'auto' } = getQuery(event)
  const data = await $fetch('https://api.open-meteo.com/v1/forecast', {
    query: {
      latitude: lat, longitude: lon, timezone: tz,
      current: 'temperature_2m,wind_speed_10m,weather_code'
    }
  })
  const c = (data as any).current
  return { temperature: c?.temperature_2m, windspeed: c?.wind_speed_10m, weathercode: c?.weather_code, time: c?.time }
})
