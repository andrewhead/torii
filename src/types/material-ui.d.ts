import { Typography, TypographyOptions } from "@material-ui/core/styles/createTypography";

declare module "@material-ui/core/styles/createTypography" {
  interface Typography {
    code: TypographyStyle;
  }

  interface TypographyOptions {
    code?: TypographyStyle;
  }
}

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    typography: Typography;
  }

  interface ThemeOptions {
    typography?: TypographyOptions;
  }
}
