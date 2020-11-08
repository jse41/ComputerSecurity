import React from 'react';
import Alert from './Alert'
import Nav from './Nav'

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt4 extends React.Component {
   render() {
      return (
         <div>
            <Alert />
            <Nav />
            <h1>This is MD5</h1>
            <p>MD5 (or the Fifth Generation of the Message-Digest Algorithm) is a hashing function that yields a 128-bit hash of any length message </p>
         </div>
      )
   }
}
export default Encrypt4;