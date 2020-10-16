import React, { Component } from 'react'
import Alert from './Alert.js'
import Nav from './Nav.js'
import logo from '../logo.svg'

class Home extends Component {
    render() {
    return (
    <div className="App">
        <Alert />
        <Nav />
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
            Learn React
        </a>
        </header>
    </div>
    );
    }
}

export default Home;