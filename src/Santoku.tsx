import * as React from 'react';
import './Santoku.css';

import logo from './logo.svg';

interface SantokuState {
  message: string
}

class Santoku extends React.Component<{}, SantokuState> {

  constructor() {
    super({});
    this.state = {
      message: "Starter message"
    };
  }

  public render() {
    return (
      <div className="Santoku">
        <header className="Santoku-header">
          <img src={logo} className="Santoku-logo" alt="logo" />
          <h1 className="Santoku-title">Welcome to React</h1>
        </header>
        <p className="Santoku-intro">
          To get started, edit <code>src/Santoku.tsx</code> and save to reload.
        </p>
        <p>
          Additional message: { this.state.message }
        </p>
      </div>
    );
  }
}

export default Santoku;
