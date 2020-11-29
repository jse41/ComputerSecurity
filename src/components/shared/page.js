import React from 'react';
import PropTypes from 'prop-types';
import Nav from "../Nav";
import '../styling/page.css';

// Generic page wrapper
const Page = ({ title, children, contentStyle, ...rest }) => (
    <div {...rest}>
        <Nav />
        <div className="container" style={{ marginTop: 60, marginBottom: 120, ...contentStyle }}>
            <h1>{title}</h1>
            {children}
        </div>
    </div>
);

Page.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    contentStyle: PropTypes.object,
};

export default Page;
