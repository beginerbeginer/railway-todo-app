import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const getFormattedLimit = (limit) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs.tz(limit, userTimezone).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}
