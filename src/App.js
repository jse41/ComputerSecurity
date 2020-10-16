import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import About from './components/About'
import Encrypt1 from './components/Encrypt1'
import Encrpty2 from './components/Encrypt2'
import Encrypt3 from './components/Encrypt3'

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
                <Route path="/encrypt1" render={(props) => <Encrypt1 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/encrypt2" render={(props) => <Encrpty2 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/encrypt3" render={(props) => <Encrypt3 {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route component={Error} />
            </Switch>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;