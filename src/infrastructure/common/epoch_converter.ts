export function DateToMiliSeconds(date: Date) {
  let epochTime = Math.floor(date.getTime() / 1000);
  return epochTime;
}

export function MiliSecondsToDate(date: number) {
  let _date = new Date(date * 1000);
  return _date;
}

export function formatEpochTime(miliseconds: number) {
  let _date = new Date(miliseconds);
  const hours = _date.getUTCHours();
  const minutes = _date.getUTCMinutes();
  const seconds = _date.getUTCSeconds();
  return `${hours}h ${minutes}m ${seconds}s`;
}
