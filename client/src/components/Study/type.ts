import { StudentFragment, StudyStudent } from "../../generated/graphql";

export interface IStudyStudent extends Omit<StudyStudent, "student"> {
  student: StudentFragment;
}
