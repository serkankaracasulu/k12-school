import { DateTime } from "luxon";
import { HourInput } from "../components/myTypes";

export function generateHours(
  hourCount: number,
  breathingTime: number,
  lessonTime: number,
  startHour: string
) {
  const hourList: HourInput[] = [];
  for (let index = 0; index < hourCount; index += 1) {
    const amount = index * (lessonTime + breathingTime);
    hourList.push({
      code: index + 1,
      start: addTimetoMinute(startHour, amount),
      finish: addTimetoMinute(startHour, amount + lessonTime)
    });
  }
  return hourList;
}

export function subTime(start: string, finish: string) {
  const startTime = DateTime.fromISO(start);
  let endTime = DateTime.fromISO(finish);
  if (startTime.valueOf() > endTime.valueOf()) {
    endTime = endTime.plus({ days: 1 });
  }
  return endTime.diff(startTime, "minutes").as("minutes");
}
export function addTimetoMinute(time: string, amount: number) {
  return DateTime.fromISO(time)
    .plus({ minutes: amount })
    .toFormat("HH:mm");
}
