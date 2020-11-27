import React, { Component } from 'react'
import Page from "../components/shared/page";
import logo from '../logo.svg'

class Home extends Component {
    render() {
        return (
            <Page title="Home">
                CSDS 344: Computer Security 
                <br></br>
                Final Project
                <br></br>
                Alessandra Sivilotti, Alex Neyman, Lucas Pham, 
                Lucas Popp, Jason Richards, Jacob Engelbrecht
                <br></br>
                <img src='images/CWRUSecurity.png' alt='Logo' style={{'width': '50%'}}></img>
            </Page>
        );
    }
}

export default Home;
