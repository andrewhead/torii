import { Color } from "@material-ui/core";
import { Palette, PaletteOptions } from "@material-ui/core/styles/createPalette";
import { Typography, TypographyOptions } from "@material-ui/core/styles/createTypography";
import { Shape, ShapeOptions } from "@material-ui/core/styles/shape";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    typography: Typography;
    palette: Palette;
    spaces: Spaces;
    shape: Shape;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
    typography?: TypographyOptions;
    spaces: SpacesOptions;
    shape?: ShapeOptions;
  }

  interface Spaces {
    text: TextSpaces;
    cell: CellSpaces;
  }

  interface TextSpaces {
    padding: number;
  }

  interface CellSpaces {
    paddingTop: number;
    paddingBottom: number;
  }

  interface SpacesOptions extends Spaces {}
}

declare module "@material-ui/core/styles/shape" {
  interface Shape {
    borderWidth: number;
  }

  interface ShapeOptions {
    borderWidth?: number;
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
