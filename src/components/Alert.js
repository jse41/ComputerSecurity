import React from 'react';
import Alert from 'react-bootstrap/Alert';
import './styling/Alert.css';

/**
 * Generates the alert at the top of page load, Bootstrap
 */
function Alertprac() {  
    return (
      <Alert className="working" variant="dark">
        <Alert.Heading>Hey! What are you doing here?</Alert.Heading>
        <p>
          It's nice to see you, but you are a little early to the party! This site is still in early development, 
          so certain features are not quite implemented yet. I'd love your feedback, but I haven't implemented 
          that quite yet either. 
        </p>
        <hr />
        <p className="mb-0">
          This site is being actively developed, so please check back soon to see what has changed! 
        </p>
      </Alert>
    );
  }
  
  export default Alertprac;