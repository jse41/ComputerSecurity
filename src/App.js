import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import About from './pages/About'
import Encrypt1 from './pages/Encrypt1'
import Encrypt2 from './pages/Encrypt2'
import Encrypt3 from './pages/Encrypt3'
import Encrypt4 from './pages/Encrypt4'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    };
    this.updateMe = this.updateMe.bind(this)
  }

  updateMe = (info) => {
    this.setState(info)
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
            <Switch>
                <Route path="/" exact render={(props) => <Home {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/about" render={(props) => <About {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/Vigenere" render={(props) => <Encrypt1 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/DES" render={(props) => <Encrypt2 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/RSA" render={(props) => <Encrypt3 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/MD5" render={(props) => <Encrypt4 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route component={Error} />
            </Switch>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
