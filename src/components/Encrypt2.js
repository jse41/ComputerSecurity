import React from 'react';
import Alert from './Alert'
import Nav from './Nav'

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt2 extends React.Component {
   render() {
      return (
         <div>
            <Alert />
            <Nav />
            <h1>This is where the second encryption demo will go!</h1>
         </div>
      )
   }
}
export default Encrypt2;