import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

window.addEventListener('message', (event) => {
  console.log("Message received");
});

declare global {
  interface Window { app: App; }
}

ReactDOM.render(
  <App ref={(component) => { if (component !== null) { window.app = component; }}} />,
  document.getElementById('root') as HTMLElement
);

setTimeout(() => {
  if (window.app !== undefined) {
    window.app.setState({ message: "Updated message" });
  }
}, 3000);