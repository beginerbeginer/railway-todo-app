import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export const getFormattedDeadLine = (deadLine) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs.tz(deadLine, userTimezone).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}
