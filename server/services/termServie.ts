import { Service, Inject } from "typedi";
import { EducationYearService } from "./educationYear";
import { ObjectId } from "mongodb";

@Service()
export class TermService {
  constructor(
    @Inject(() => EducationYearService)
    private readonly educationYearService: EducationYearService
  ) {}
  async getById(
    instId: ObjectId,
    schoolId: ObjectId,
    educationYearId: ObjectId,
    termId: ObjectId
  ) {
    const educationYear = await this.educationYearService.getById(
      instId,
      schoolId,
      educationYearId
    );
    if (!educationYear) throw new Error("Education year didn't find");
    const term = educationYear.terms.id(termId);
    if (term) return term;
  }
}
