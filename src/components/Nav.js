import React from 'react';
import {Link} from "react-router-dom";
import './styling/Nav.css';
//import './Styling/Boot.css';

/**
 * Navigation Bar is generated here, uses Bootstrap and Reacter Router for links
 */
function Nav() {
  return (
    <nav className="navbar navbar-expand-md">
        <div className="navbar-brand">
          <Link to="/"><div className="navImg"><img src="images/logo_j_tight_white.png" alt="Logo"></img></div></Link>
        </div>
        <button className="navbar-toggler navbar-dark" type="button" data-toggle="collapse" data-target="#main-navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="main-navigation">
          <ul className="navbar-nav">
            <li className="nav-item">
              <div className="nav-link" >
                <Link to="/">Home</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <Link to="/about">About</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <Link to="/encrypt1">Vigenere Cipher</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <Link to="/encrypt2">Encrypt2</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link">
                <Link to="/encrypt3">Encrypt3</Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
  );
}

export default Nav;