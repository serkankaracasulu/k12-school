import * as React from "react";

import DriverList from "../../../DriverList/DriverList";

export default function SchoolDrivers({ i }: { i: string }) {
  return <DriverList studentId={i} title="Sürücüler" />;
}
