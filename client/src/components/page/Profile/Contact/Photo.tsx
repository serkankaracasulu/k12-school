import * as React from "react";

import { Avatar, Button, DialogActions } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CloudUpload as UploadIcon } from "@material-ui/icons";

import { useUserChangePhotoMutation } from "../../../../generated/graphql";
import imageToString from "../../../../helper/imageToString";
import DialogWrapper from "../../../DialogW";

type PropsType = {
  setOpen(): void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 150,
      height: 150,
      marginBottom: theme.spacing(1),
    },
    container: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
    input: {
      visibility: "hidden",
      width: 0,
      height: 0,
    },
  })
);
interface UserChangePhoto {
  changeUserPhoto: { success: boolean };
}
export default function ProfilePhotoUploadForm(props: PropsType) {
  const { setOpen } = props;
  const classes = useStyles();
  const InputRef = React.useRef<HTMLInputElement>(null);
  const [updatePhoto] = useUserChangePhotoMutation({
    onCompleted: (tData) => {
      if (tData.changeUserPhoto.success) setOpen();
    },
  });
  const [image64, setImage64] = React.useState("");
  function imageRead(e: React.ChangeEvent<HTMLInputElement>) {
    imageToString(e, (result) => setImage64(result));
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image64) return;
    updatePhoto({ variables: { profilePhotoBase64: image64 } });
  };
  return (
    <DialogWrapper title="Profile Foroğrafı" setOpen={setOpen} maxWidth="xs">
      <div className={classes.container}>
        <Avatar className={classes.avatar} src={image64} />
        <Button
          color="primary"
          endIcon={<UploadIcon />}
          onClick={() => InputRef.current?.click()}
        >
          FOTOĞRAF
        </Button>
      </div>
      <DialogActions>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={imageRead}
            className={classes.input}
            required
            ref={InputRef}
          />

          <Button variant="contained" color="primary" type="submit">
            Kaydet
          </Button>
        </form>
      </DialogActions>
    </DialogWrapper>
  );
}
