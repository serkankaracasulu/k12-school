import * as React from "react";

import Context from "../../../Context";
import DriverList from "../../../DriverList/DriverList";

export default function SchoolDriversOfStudent() {
  const { studentIndex } = React.useContext(Context);
  return (
    <DriverList studentId={studentIndex} title="Benim servis sürücülerim" />
  );
}
