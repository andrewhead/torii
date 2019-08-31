import { Color } from "@material-ui/core";
import { Palette, PaletteOptions } from "@material-ui/core/styles/createPalette";
import { Typography, TypographyOptions } from "@material-ui/core/styles/createTypography";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    typography: Typography;
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
    typography?: TypographyOptions;
  }
}

/**
 * Extend palette to have color scales for primary and secondary.
 */
declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    primaryScale: Color;
    secondaryScale: Color;
  }

  interface PaletteOptions {
    primaryScale?: Partial<Color>;
    secondaryScale?: Partial<Color>;
  }
}

/**
 * Extend typography to include 'code' font.
 */
declare module "@material-ui/core/styles/createTypography" {
  interface Typography {
    code: TypographyStyle;
    text: TypographyStyle;
  }

  interface TypographyOptions {
    code?: TypographyStyle;
    text?: TypographyStyle;
  }
}
