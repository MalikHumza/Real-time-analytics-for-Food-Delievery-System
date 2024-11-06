export function DateToMiliSeconds(date: Date) {
  let epochTime = Math.floor(date.getTime() / 1000);
  return epochTime;
}

export function MiliSecondsToDate(date: number) {
  let _date = new Date(date * 1000);
  return _date;
}
