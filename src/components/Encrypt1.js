import React from 'react';
import Alert from './Alert'
import Nav from './Nav'

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt1 extends React.Component {
   render() {
      return (
         <div>
            <Alert />
            <Nav />
            <h1>Mine as well have an about page...</h1>
         </div>
      )
   }
}
export default Encrypt1;