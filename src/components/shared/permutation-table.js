import _ from 'lodash';
import React from 'react';
import './permutation-table.css';

const PermutationTable = ({ title = 'Permutation Table', table, columns }) => {
    const rows = _.chunk(table, columns);

    return (
        <table className="permutation-table">
            <tbody>
                <tr key="head">
                    <th colSpan={columns}>{title}</th>
                </tr>
                {rows.map((row, r) => (
                    <tr key={r}>
                        {row.map((bit, c) => (
                            <td key={r}>
                                <span className="index">{(r * columns) + c + 1}</span>
                                <span className="permuted">{bit}</span>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default PermutationTable;
