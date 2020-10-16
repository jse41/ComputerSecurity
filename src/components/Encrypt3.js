import React from 'react';
import Alert from './Alert'
import Nav from './Nav'

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt3 extends React.Component {
   render() {
      return (
         <div>
            <Alert />
            <Nav />
            <h1>Well we need 3 Encryption Algorithms...</h1>
         </div>
      )
   }
}
export default Encrypt3;