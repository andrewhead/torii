# Santoku

Thank you to the https://github.com/rebornix/vscode-webview-react
project for providing a starting point for this React app,
and tips on how to integrate it into VSCode.

VSCode integration is not handled in this repository. The
Santoku editor is meant to be pluggable into arbitrary IDEs.
To see the code that integrates it with VSCode, check out
https://github.com/andrewhead/vscode-santoku and
https://github.com/andrewhead/santoku-editor-adapter.

To run the Santoku tutorial editor in your integrated
development environment of choice, build the project (see
instructions below), open the `index.html` in an embedded
browser in the environment, and run JavaScript initializing
the `EditorAdapter` with a `EditorConnector` that allows
communication with the IDE. The JavaScript will look like,
roughly:

```javascript
new EditorAdapter(new MyEditorConnector(options));
```

For an example of initializing a EditorAdapter with an
IDE-specific connector, see the code in the webview for the
VSCode extension in https://github.com/andrewhead/vscode-santoku.

## Development

Run following commands in the terminal

```bash
npm install
npm run build
```

Then to test standalone (which will only provide a small
subset of the functionality...), run:

```bash
npm run start
```

### Development Conventions

- Apply styles using the `styled` function.
- Unit tests should test unstyled components.
- Themes should be be applied in `styled` functions. If a
  component needs access to a theme, pass it in as a
  property. The `useTheme` hook breaks in unit tests
  that use shallow rendering for components.
