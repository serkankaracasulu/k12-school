import * as React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Loading from "./components/Loading";
import ConfirmEmail from "./components/page/Auth/ConfirmEmail";
import ForgotPassword from "./components/page/Auth/ForgotPassword";
import ISignUpStep from "./components/page/Auth/ISignUp/Steps";
import ParentEmailConfirm from "./components/page/Auth/Parent/ConfirmEmail";
import ParentForgotPassword from "./components/page/Auth/Parent/ForgotPassword";
import ParentResetPassword from "./components/page/Auth/Parent/ResetPassword";
import ResetPassword from "./components/page/Auth/ResetPassword";
import SignIn from "./components/page/Auth/SignIn";
import SignUp from "./components/page/Auth/SignUp";
import Checkout from "./components/page/checkout/CheckOut";
import Dashboard from "./components/page/dashboard/Index";
import Driver from "./components/page/driveManegment/Index";
import Managment from "./components/page/manegment/Index";
import Messaging from "./components/page/Message/Index";
import Pricing from "./components/page/pricing/Pricing";
import Profile from "./components/page/Profile/Index";
import Security from "./components/page/Security/ChangePassword";
import StudentManegmant from "./components/page/StudentManegment/Index";
import StudentSignIn from "./components/page/StudentManegment/SignIn";
import Teacher from "./components/page/teacherManegment/Index";
import UserPage from "./components/page/User/Index";
import { RouterCons } from "./components/Routers";
import ProfileSetting from "./components/UserSettings";
import { Role, useActiveUserQuery } from "./generated/graphql";

const authRoutes = [
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/messaging",
    component: Messaging,
  },
  {
    path: "/profileSetting",
    component: ProfileSetting,
  },
  {
    path: "/user/:userId",
    component: UserPage,
  },
  {
    path: "/sucurity",
    component: Security,
    role: Role.User,
  },
];
const studentRoutes = [
  {
    path: "/student",
    component: StudentManegmant,
  },
];
const userRoleBaseRoutes = [
  {
    path: "/myschools",
    component: Dashboard,
    role: Role.Owner,
  },
  {
    path: "/managment",
    component: Managment,
    role: Role.SuperAdmin,
  },
  {
    path: RouterCons.teacher.base,
    component: Teacher,
    role: RouterCons.teacher.role,
  },
  {
    path: "/driver",
    component: Driver,
    role: Role.Driver,
  },
];
const unAuthRoutes = [
  {
    path: "/signin",
    component: SignIn,
  },
  {
    path: "/signinstudent",
    component: StudentSignIn,
  },
  {
    path: "/signup",
    component: SignUp,
  },
  {
    path: "/forgotpassword",
    component: ForgotPassword,
  },
  {
    path: "/recovery",
    component: ResetPassword,
  },
  {
    path: "/confirm",
    component: ConfirmEmail,
  },
  {
    path: "/isignup",
    component: ISignUpStep,
  },
  {
    path: "/confirmp",
    component: ParentEmailConfirm,
  },
  {
    path: "/recoveryp",
    component: ParentResetPassword,
  },
  {
    path: "/forgotpasswordp",
    component: ParentForgotPassword,
  },
];

function App() {
  const { data, loading, error } = useActiveUserQuery();
  console.log("data", data, error);

  if (loading) return <Loading />;
  return (
    <React.Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Pricing} />
          {!data &&
            unAuthRoutes.map((route) => (
              <Route path={route.path} key={route.path}>
                <route.component />
              </Route>
            ))}
          {data &&
            authRoutes.map((route) => (
              <Route path={route.path} key={route.path}>
                <route.component />
              </Route>
            ))}
          {studentRoutes.map((route) => (
            <Route path={route.path} key={route.path}>
              <route.component />
            </Route>
          ))}
          {data &&
            userRoleBaseRoutes.map((route) => (
              <Route path={route.path} key={route.path}>
                {data.activeUser.roles.includes(route.role as Role) ? (
                  <route.component />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
            ))}
          <Route path="/checkout" component={Checkout} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </React.Suspense>
  );
}

export default App;
