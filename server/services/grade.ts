import { Service } from "typedi";
import { Exam, ExamModel, Grade } from "../models/exam";
import { ObjectId } from "mongodb";

@Service()
export class GradeService {
  create(studentId: ObjectId, grade: number) {
    return new Grade(studentId, grade);
  }
}
