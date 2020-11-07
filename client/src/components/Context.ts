import * as React from "react";

import { SetSnackBarProp } from "./myTypes";

export default React.createContext<{
  setPr: SetSnackBarProp;
  studentIndex?: string | undefined;
  setStudentIndex: React.Dispatch<React.SetStateAction<undefined | string>>;
  toState: [string, React.Dispatch<React.SetStateAction<string>>];
}>({
  setPr: () => {},
  studentIndex: undefined,
  setStudentIndex: () => {},
  toState: ["", () => {}],
});
