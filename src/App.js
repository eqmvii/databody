import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = { message: "Loading..." };

  // Load some data from the server to demonstrate communication between
  // the client and Node
  async componentDidMount() {
    try {
      const data = await fetch('/example-path');
      const json = await data.json();
      this.setState(json);
    } catch (e) {
      console.log("Failed to fetch message", e);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to NKO!</h1>
        </header>
        <p className="App-intro">
          Coming soon: <code>computer code</code> and maybe eventually an "app" of some kind.
        </p>
        <p>
          {this.state.message}
        </p>
      </div>
    );
  }
}

export default App;
