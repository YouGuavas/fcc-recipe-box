import React, { Component } from 'react';
import { RecipeBox } from './RecipeBox';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Recipe Box!</h1>
        </header>
          <RecipeBox />
      </div>
    );
  }
}

export default App;
