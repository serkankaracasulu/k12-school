const gql = require("graphql-tag");
module.exports.CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $password: String!
    $email: String!
    $phone: String
    $institutionName: String
  ) {
    createUser(
      data: {
        firstName: $firstName
        lastName: $lastName
        password: $password
        email: $email
        phone: $phone
        institutionName: $institutionName
      }
    ) {
      _id
      firstName
      lastName
      email
      createdAt
    }
  }
`;
module.exports.SIGNIN_USER = gql`
  mutation SiginUser($password: String!, $email: String!) {
    signIn(data: { password: $password, email: $email }) {
      token
    }
  }
`;
module.exports.RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $_id: ID!, $password: String) {
    resetPassword(data: { token: $token, _id: $_id, password: $password }) {
      success
    }
  }
`;
module.exports.CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($token: String!, $email: String!) {
    confirmEmail(data: { token: $token, email: $email }) {
      success
    }
  }
`;
module.exports.FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
    }
  }
`;
module.exports.RESEND_CONFIRM_EMAIL = gql`
  mutation ReSendConfirmEmail($email: String!, $password: String!) {
    reSendConfirmEmail(data: { email: $email, password: $password }) {
      success
    }
  }
`;
//School
const LESSON_PART = gql`
  fragment lessonPart on Lesson {
    _id
    lessonId {
      _id
      name
    }
    name
    weeklyHour
    createdAt
    weeklySchedule {
      day
      hour
    }
  }
`;
const CLASS_PART = gql`
  fragment classPart on Class {
    _id
    name
    level
    code
    code1
    group
    createdAt
    lessons {
      ...lessonPart
    }
  }
  ${LESSON_PART}
`;
const HOUR_PART = gql`
  fragment hourPart on Hours {
    _id
    name
    default
    hour {
      _id
      code
      start
      finish
    }
  }
`;
const TERM_PART = gql`
  fragment termPart on Term {
    _id
    name
    start
    finish
  }
`;
module.exports.ADD_LESSON = gql`
  mutation AddLesson(
    $lessonId: ID
    $schoolId: ID!
    $classId: ID!
    $name: String
    $weeklyHour: Int!
  ) {
    addLesson(
      lesson: {
        lessonId: $lessonId
        schoolId: $schoolId
        classId: $classId
        name: $name
        weeklyHour: $weeklyHour
      }
    ) {
      ...lessonPart
    }
  }
  ${LESSON_PART}
`;
const SCHOOL_PART = gql`
  fragment schoolPart on School {
    _id
    eOkulCode
    name
    schoolKind {
      _id
      name
    }
    headMaster {
      _id
    }
    hours {
      ...hourPart
    }
    terms {
      ...termPart
    }
    createdAt
    classes {
      ...classPart
    }
    __typename
  }
  ${CLASS_PART}
  ${HOUR_PART}
  ${TERM_PART}
`;
module.exports.CREATE_SCHOOL = gql`
  mutation CreateSchool(
    $_id: ID
    $name: String!
    $eOkulCode: String
    $schoolKind: String
  ) {
    createSchool(
      data: {
        _id: $_id
        name: $name
        eOkulCode: $eOkulCode
        schoolKind: $schoolKind
      }
    ) {
      ...schoolPart
    }
  }
  ${SCHOOL_PART}
`;

module.exports.SCHOOLS = gql`
  query Schools {
    schools {
      ...schoolPart
    }
  }
  ${SCHOOL_PART}
`;
module.exports.CLASS = gql`
  query Class($schoolId: ID!, $classId: ID!) {
    class(schoolId: $schoolId, classId: $classId) {
      ...classPart
    }
  }
  ${CLASS_PART}
`;

module.exports.SCHOOL = gql`
  query School($id: ID!) {
    school(id: $id) {
      ...schoolPart
    }
  }
  ${SCHOOL_PART}
`;
module.exports.TEACHERS = gql`
  query Teachers {
    teachers {
      _id
    }
  }
`;
const TEACHER_APPLICATION = gql`
  fragment teacherAppPart on TeacherApplication {
    _id
    email
    user {
      firstName
      lastName
    }
    status
    createdAt
  }
`;
module.exports.INVITATION_TEACHERS = gql`
  mutation InvitationTeachers($emails: [String!]!) {
    invitationTeachers(emails: $emails) {
      ...teacherAppPart
    }
  }
  ${TEACHER_APPLICATION}
`;
module.exports.CLASSES = gql`
  query Classes($id: ID!) {
    classes(id: $id) {
      ...classPart
    }
  }
  ${CLASS_PART}
`;
module.exports.HOURS = gql`
  query Hours($schoolId: ID!, $id: ID!) {
    hours(schoolId: $schoolId, id: $id) {
      ...hourPart
    }
  }
  ${HOUR_PART}
`;
module.exports.TEACHER_APLICATIONS = gql`
  query TeacherApplications {
    teacherApplications {
      ...teacherAppPart
    }
  }
  ${TEACHER_APPLICATION}
`;
module.exports.CREATE_HOURS = gql`
  mutation CreateHours(
    $_id: ID
    $schoolId: ID!
    $name: String!
    $default: Boolean
    $hour: [HourInput!]!
  ) {
    createHour(
      data: {
        _id: $_id
        schoolId: $schoolId
        name: $name
        default: $default
        hour: $hour
      }
    ) {
      ...hourPart
    }
  }
  ${HOUR_PART}
`;
module.exports.CREATE_TERM = gql`
  mutation CreateTerm(
    $_id: ID
    $schoolId: ID!
    $name: String!
    $start: Date!
    $finish: Date!
  ) {
    createTerm(
      data: {
        _id: $_id
        schoolId: $schoolId
        name: $name
        start: $start
        finish: $finish
      }
    ) {
      ...termPart
    }
  }
  ${TERM_PART}
`;
const USER_NAME_PART = gql`
  fragment userNamePart on User {
    _id
    firstName
    lastName
    email
  }
`;
module.exports.ADD_TEACHER = gql`
  mutation AddTeacher($applicationId: ID!) {
    addTeacher(applicationId: $applicationId) {
      _id
      teacher {
        ...userNamePart
      }
    }
  }
  ${USER_NAME_PART}
`;

module.exports.CREATE_CLASS = gql`
  mutation CreateClass(
    $_id: ID
    $schoolId: ID!
    $name: String
    $level: Int
    $code: String
    $code1: String
    $group: ID
  ) {
    createClass(
      data: {
        _id: $_id
        schoolId: $schoolId
        name: $name
        level: $level
        code: $code
        code1: $code1
        group: $group
      }
    ) {
      ...classPart
    }
  }
  ${CLASS_PART}
`;
