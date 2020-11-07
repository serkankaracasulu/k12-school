import { ApolloError } from "apollo-client";
import * as React from "react";

import { Typography } from "@material-ui/core";

type PropsType = {
  error: ApolloError;
};
export default function ErrorMessage(props: PropsType) {
  const { error } = props;
  return (
    <Typography variant="body2">{error.graphQLErrors[0]?.message}</Typography>
  );
}
