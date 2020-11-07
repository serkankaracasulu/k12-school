import * as React from "react";

export default React.createContext<{
  className: string;
  setClassName(className: string): void;
}>({
  className: "",
  setClassName: () => {},
});
