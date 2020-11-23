import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import About from './pages/About'
import VigenerePage from './pages/vigenere-page'
import DesPage from './pages/des-page'
import RsaPage from './pages/rsa-page'
import Md5Page from './pages/md5-page'

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
                <Route path="/Vigenere" render={(props) => <VigenerePage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/DES" render={(props) => <DesPage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/RSA" render={(props) => <RsaPage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/MD5" render={(props) => <Md5Page {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route component={Error} />
            </Switch>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
