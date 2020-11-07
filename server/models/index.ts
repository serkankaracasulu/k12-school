import { UserModel, TokenModel } from "./user";
import { InstitutionModel } from "./Institution";
import { LessonInboxModel } from "./lessonInbox";
import { HomeWorkModel } from "./homeWork";
import { UniversityModel } from "./university";
import { ExamModel } from "./exam";
import { IlModel } from "./ilIlce";
import { TeacherFieldModel } from "./teacherField";
import { School } from "./schoolGModel";
import { DepartmentModel } from "./department";
import { StudentModel } from "./student";
import { TeacherApplicationModel } from "./teacherApplication";
import { ClassLessonModel } from "./lessonSchema";
import { AbsenceModel } from "./absence";
import { StudyModel } from "./study";
import { MessageModel, InboxModel } from "./personInbox";
import { PersonModel } from "./person";
export default {
  model: {
    Institution: InstitutionModel,
    User: UserModel,
    Token: TokenModel,
    School,
    Il: IlModel,
    Department: DepartmentModel,
    TeacherField: TeacherFieldModel,
    TeacherApplication: TeacherApplicationModel,
    University: UniversityModel,
    Student: StudentModel,
    LessonInbox: LessonInboxModel,
    HomeWork: HomeWorkModel,
    Exam: ExamModel,
    Absence: AbsenceModel,
    Study: StudyModel,
    Message: MessageModel,
    Inbox: InboxModel,
    ClassLesson: ClassLessonModel,
    Person: PersonModel,
  },
};
