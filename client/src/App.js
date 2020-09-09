import React from 'react';
import logo from './logo.svg';
import './App.css';
import OtherPage from "./OtherPage";
import Fib from "./Fib";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Fibonacci Calculator 🙌🏻 🙌🏻 🙌🏻 version k8s!</Link>
          <Link to="otherpage">Other Page!</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path='/otherpage' component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
