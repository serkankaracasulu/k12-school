import { VoyageFragment } from "../../../generated/graphql";
import { Role, UserToken } from "../../myTypes";

export const isAuthenticationDriverforVoyage = (
  voyage: VoyageFragment,
  token?: UserToken | null
) => {
  return (
    !!token &&
    token.roles.includes(Role.driver) &&
    voyage.driverId === token._id
  );
};
