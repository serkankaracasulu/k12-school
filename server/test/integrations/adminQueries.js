const gql = require("graphql-tag");
const LESSON_PART = gql`
  fragment lessonPart on LessonG {
    _id
    name
    teacherFields {
      _id
      name
    }
  }
`;
const CLASS_LESSON_PART = gql`
  fragment classLessonPart on ClassLesson {
    _id
    lessonId
    count
    required
  }
`;
const DEPARTMENTS_PART = gql`
  fragment departmentsPart on TeacherField {
    departments {
      _id
      name
    }
  }
`;
exports.CREATE_LESSON = gql`
  mutation CreateLessonG($name: String!, $teacherFields: [ID!]) {
    createLessonG(lesson: { name: $name, teacherFields: $teacherFields }) {
      ...lessonPart
    }
  }
  ${LESSON_PART}
`;
const CLASS_PART = gql`
  fragment classGPart on ClassG {
    _id
    level
    lessons {
      ...classLessonPart
    }
  }
  ${CLASS_LESSON_PART}
`;
exports.EDIT_LESSON = gql`
  mutation EditLessonG($name: String, $_id: ID!, $teacherFields: [ID!]) {
    editLessonG(
      lesson: { name: $name, _id: $_id, teacherFields: $teacherFields }
    ) {
      ...lessonPart
    }
  }
  ${LESSON_PART}
`;

exports.CREATE_SCHOOLG = gql`
  mutation CreateSchoolG($name: String!, $classes: [ClassesGInput!]!) {
    createSchoolG(data: { name: $name, classes: $classes }) {
      _id
      name
      classes {
        _id
        level
        lessons {
          ...classLessonPart
        }
      }
    }
  }
  ${CLASS_LESSON_PART}
`;

exports.ADD_LESSON_TO_CLASS = gql`
  mutation AddLessonToClass(
    $schoolId: ID!
    $classId: ID!
    $lessonId: ID!
    $count: Int
    $required: Boolean
  ) {
    addLessonToClass(
      data: {
        schoolId: $schoolId
        classId: $classId
        lessonId: $lessonId
        count: $count
        required: $required
      }
    ) {
      ...classGPart
    }
  }
  ${CLASS_PART}
`;

exports.ADD_TEACHERFIELDS_TO_LESSON = gql`
  mutation AddTeacherFieldsToLesson($ids: [ID!]!, $_id: ID!) {
    addTeacherFieldsToLesson(ids: $ids, _id: $_id) {
      ...lessonPart
    }
  }
  ${LESSON_PART}
`;
exports.EDIT_TEACHER_FIELD = gql`
  mutation EditTeacherField($name: String!) {
    editTeacherField(name: $name) {
      _id
      name
    }
  }
`;
exports.EDIT_DEPARTMENT = gql`
  mutation EditDepartment($name: String!) {
    editDepartment(department: { name: $name }) {
      _id
      name
    }
  }
`;
exports.ADD_DEPARTMENTS_TO_TEACHERFIELD = gql`
  mutation AddDepartmentsToTeacherField($ids: [ID!]!, $_id: ID!) {
    addDepartmentsToTeacherField(ids: $ids, _id: $_id) {
      _id
      name
      ...departmentsPart
    }
  }
  ${DEPARTMENTS_PART}
`;
exports.REMOVE_DEPARTMENTS_TO_TEACHERFIELD = gql`
  mutation RemoveDepartmentsToTeacherField($id: ID!, $_id: ID!) {
    removeDepartmentsToTeacherField(id: $id, _id: $_id) {
      _id
      name
      ...departmentsPart
    }
  }
  ${DEPARTMENTS_PART}
`;
