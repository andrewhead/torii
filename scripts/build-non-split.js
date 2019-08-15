#!/usr/bin/env node

// Script from https://github.com/rebornix/vscode-webview-react
// Disables code splitting into chunks
// See https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838

const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js");
let config = defaults.__get__("config");

/**
 * Debug option: create a source map using 'eval-source-map'. This method of producing a source
 * map is chosen as it's one way to make a sourcemap readable to VSCode when this project is used
 * in an extension. That said, it produces a very large bundle.
 */
const debug = process.argv.indexOf("--debug") !== -1;

if (debug) {
  config.devtool = "eval-source-map";
}

config.optimization.splitChunks = {
  cacheGroups: {
    default: false
  }
};

config.optimization.runtimeChunk = false;
