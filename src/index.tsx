import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from "santoku-store";
import './index.css';
import Santoku from './Santoku';

ReactDOM.render(
  <Provider store={store}>
    <Santoku />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

export * from "santoku-editor-adapter";
