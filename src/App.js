import React, { Component } from "react";
import ButtonGroup from "./Components/ButtonGroup";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ButtonGroup />
        </header>
      </div>
    );
  }
}

export default App;
