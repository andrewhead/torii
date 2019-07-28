import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Santoku from './Santoku';
import './index.css';

window.addEventListener('message', (event) => {
  console.log("Message received");
});

declare global {
  interface Window { santoku: Santoku; }
}

ReactDOM.render(
  <Santoku ref={(santoku) => { if (santoku !== null) { window.santoku = santoku; }}} />,
  document.getElementById('root') as HTMLElement
);

setTimeout(() => {
  if (window.santoku !== undefined) {
    window.santoku.setState({ message: "Updated message" });
  }
}, 3000);