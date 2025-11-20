const padZero = (num) => (num < 10 ? "0" + num : num)
const defaults = {
  includeMonth: true,
  includeTime: true,
  includeDay: true,
}
export const getNow = ({
  includeMonth,
  includeTime,
  includeDay,
} = defaults) => {
  let date = new Date()
  let year = date.getFullYear()
  let month = padZero(date.getMonth() + 1)
  let day = padZero(date.getDate())
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return `${year}-${includeMonth ? month : ""}-${includeDay ? day : ""} ${
    includeTime ? `${hour}:${minute}:${second}` : ""
  }`
}
