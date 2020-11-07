import { blue, red } from "@material-ui/core/colors";
import { trTR } from "@material-ui/core/locale";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme(
  {
    palette: {
      primary: blue,
      error: red,
    },
  },
  trTR
);

export default theme;
