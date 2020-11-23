import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import bitHandling from "../../bit-handling-2";
import './utf-display.css';

const UTFDisplay = ({ ascii }) => {
    const letters = ascii.split('');
    const charCodes = letters.map(s => s.charCodeAt(0));
    const bitCodes = _.chunk(bitHandling.strToBits(ascii).split(''), 16).map(bits => bits.join(''));

    return (
        <div className="utf-display">
            <table>
                <tr>
                    {letters.map(letter => (
                        <td>
                            <h1>{letter}</h1>
                        </td>
                    ))}
                </tr>
                <tr>
                    {bitCodes.map(code => (
                        <td>
                            <div style={{ fontFamily: 'monospace' }}>
                                {code}
                            </div>
                        </td>
                    ))}
                </tr>
            </table>
        </div>
    )
}

UTFDisplay.propTypes = {
    ascii: PropTypes.string,
};

export default UTFDisplay;
