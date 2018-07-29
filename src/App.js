import React, { Component } from 'react';
import './App.css';
import Compass from './components/Compass';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Compass url="http://localhost:1337/stream" />
      </div>
    );
  }
}

export default App;
