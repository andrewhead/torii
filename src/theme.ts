import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export default function createTheme(options?: ThemeOptions) {
  options = options || {};
  return createMuiTheme({
    ...options,
    palette: {
      /*
       * Generated with the Material UI Color Tool
       * https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=1565C0&primary.text.color=ffffff&secondary.color=424242
       */
      primary: {
        main: "#1565c0",
        light: "#5e92f3",
        dark: "#003c8f"
      },
      secondary: {
        main: "#424242",
        light: "#6d6d6d",
        dark: "#1b1b1b"
      }
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
        fontSize: 20
      }
    }
  });
}
