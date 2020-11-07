import { Service, Inject } from "typedi";
import { WeeklyHourService } from "./weeklyHour";
import { ObjectId } from "mongodb";

@Service()
export class HourService {
  constructor(
    @Inject(() => WeeklyHourService)
    private readonly weeklyHourService: WeeklyHourService
  ) {}
  async getByCode(instId: ObjectId, schoolId: ObjectId, code: number) {
    const weeklyHour = await this.weeklyHourService.getById(instId, schoolId);
    if (!weeklyHour) throw new Error("Weekly hour didn't find");
    return weeklyHour.hour.find((h) => h.code === code);
  }
}
