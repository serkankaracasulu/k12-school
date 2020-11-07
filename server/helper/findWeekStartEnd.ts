import { DateTime } from "luxon";
/**
 * Finds the beginning and end of the week
 * @param week value of how many ahead of this week
 * @returns [start,end]
 */
export default function (week: number): [Date, Date] {
  const startOfWeek = DateTime.fromObject({
    hour: 1,
    minute: 0,
    zone: "utc",
  })
    .startOf("week")
    .plus({ weeks: week });
  const endOfWeek = DateTime.fromObject({
    hour: 23,
    minute: 59,
    zone: "utc",
  })
    .endOf("week")
    .plus({ weeks: week });
  return [startOfWeek.toJSDate(), endOfWeek.toJSDate()];
}
