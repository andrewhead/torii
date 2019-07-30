import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import Santoku from './Santoku';
import { store } from './store';

window.addEventListener('message', (event) => {
  console.log("Message received");
});

/*
declare global {
  interface Window { santoku: Santoku; }
}
*/

ReactDOM.render(
  <Provider store={store}>
    <Santoku />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

/* ref={(santoku) => { if (santoku !== null) { window.santoku = santoku; }}} />, */

/*
setTimeout(() => {
  if (window.santoku !== undefined) {
    window.santoku.setState({ message: "Updated message" });
  }
}, 3000);
*/