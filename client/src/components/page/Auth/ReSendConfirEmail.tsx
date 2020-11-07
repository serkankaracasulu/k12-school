import * as React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useReSendConfirmEmailMutation } from "../../../generated/graphql";
import Loading from "../../Loading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.dark,
      cursor: "pointer",
    },
  })
);
const message = {
  c102: "Eposta veya şifre yanlış",
};
type PropsType = {
  email: string;
  password: string;
};
export default function ReSendConfirmEmail(props: PropsType) {
  const { email, password } = props;
  const classes = useStyles();
  const [error, setError] = React.useState("");
  const [reSendConfirmEmail, { data, loading }] = useReSendConfirmEmailMutation(
    {
      onError: (err) => {
        if (err.graphQLErrors) {
          if (err.graphQLErrors[0].extensions) {
            const { code } = err.graphQLErrors[0].extensions;
            setError(code);
          }
        }
      },
    }
  );
  const handleReSendEmail = async () => {
    reSendConfirmEmail({
      variables: { email, password },
    });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (+event.key === 13) {
      reSendConfirmEmail({
        variables: { email, password },
      });
    }
  };
  return (
    <>
      {loading && <Loading />}
      {data ? (
        `${email} adresine email gönderildi.`
      ) : (
        <span
          className={classes.link}
          onClick={handleReSendEmail}
          onKeyDown={handleKeyDown}
          color="error"
          role="button"
          tabIndex={-1}
        >
          Lütfen hesabınızı onaylayınız. Henüz email almadınız mı?
          {error && message.c102}
        </span>
      )}
    </>
  );
}
