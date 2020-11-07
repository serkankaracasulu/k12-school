/**
 * Finds the beginning and end of the day
 * @returns [start,end]
 */
export function getDayStartEnd() {
  const now = new Date(Date.now());
  const start = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getUTCDate(), 0, 0)
  );
  const finish = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getUTCDate(), 23, 59)
  );
  return [start, finish];
}
