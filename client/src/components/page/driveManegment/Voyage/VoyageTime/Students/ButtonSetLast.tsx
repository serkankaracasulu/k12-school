import * as React from "react";

import { Button } from "@material-ui/core";

import {
  SetVoyageOrderLastMutationVariables,
  useSetVoyageOrderLastMutation,
} from "../../../../../../generated/graphql";

type PropsType = {
  variables: SetVoyageOrderLastMutationVariables;
};

export default function ButtonStuntInfoOrderLast({ variables }: PropsType) {
  const [setLast] = useSetVoyageOrderLastMutation();

  const handleUpdate = () => {
    setLast({ variables });
  };
  return <Button onClick={handleUpdate}>En son sıraya ata</Button>;
}
