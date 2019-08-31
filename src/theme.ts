import { blue, grey } from "@material-ui/core/colors";
import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export default function createTheme(options?: ThemeOptions) {
  options = options || {};
  const primaryScale = grey;
  const secondaryScale = blue;
  return createMuiTheme({
    ...options,
    palette: {
      primary: {
        main: primaryScale[200],
        light: primaryScale[50],
        dark: primaryScale[400]
      },
      primaryScale,
      secondary: {
        main: secondaryScale[500],
        light: secondaryScale[300],
        dark: secondaryScale[700]
      },
      secondaryScale
    },
    typography: {
      code: {
        fontFamily: "Monaco",
        fontWeight: "normal",
        fontStyle: "normal",
        color: "black",
        /*
         * Define this property as a number; the Monaco code editors will only reflect this font
         * size if this is defined as a number.
         */
        fontSize: 16
      },
      /*
       * Fonts for the body of the tutorial.
       */
      text: {
        fontFamily: 'Lato, "Segoe UI", Roboto, Helvetica, Arial,sans-serif',
        fontWeight: "normal",
        fontStyle: "normal",
        color: "black",
        fontSize: 18
      }
    }
  });
}
