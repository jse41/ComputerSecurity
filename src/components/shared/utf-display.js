import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import bitHandling from "../../bit-handling-2";
import './utf-display.css';

const UTFDisplay = ({ ascii, columns }) => {
    if (!columns) columns = ascii.length;
    const letters = ascii.split('');
    const bitCodes = _.chunk(bitHandling.strToBits(ascii).split(''), 16).map(bits => bits.join(''));
    const cells = _.zip(letters, bitCodes).map(([letter, bits]) => ({ letter, bits }));
    const rows = _.chunk(cells, columns);

    return (
        <div className="utf-display">
            <table>
                <tbody>
                    {rows.map((cells, r) => (
                        <React.Fragment>
                            <tr key={`${r}a`}>
                                {cells.map(({ letter }, c) => (
                                    <td key={c}>
                                        <div className="index">{(r * columns) + c + 1}</div>
                                        <h1>{letter}</h1>
                                    </td>
                                ))}
                            </tr>
                            <tr key={`${r}b`}>
                                {cells.map(({ bits }, c) => (
                                    <td className="bits" key={c}>
                                        <div style={{ fontFamily: 'monospace' }}>
                                            {bits}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

UTFDisplay.propTypes = {
    ascii: PropTypes.string,
    columns: PropTypes.number,
};

export default UTFDisplay;
