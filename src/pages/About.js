import React from 'react';
import Page from "../components/shared/page";

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class About extends React.Component {
   render() {
      return (
          <Page title="About">
              Might as well have an about page...
          </Page>
      )
   }
}
export default About;
