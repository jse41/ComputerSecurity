import _ from 'lodash';
import React from 'react';

const PermutationTable = ({ table, columns }) => {
    const rows = _.chunk(table, columns);
    return (
        <table style={{ tableLayout: 'fixed', borderBottom: 'solid 1px #969696', borderRight: 'solid 1px #969696' }}>
            <tbody>
            {rows.map(row => (
                <tr>{
                    row.map(bit => <td style={{ borderTop: 'solid 1px #969696', borderLeft: 'solid 1px #969696' }}>{bit}</td>)
                }</tr>
            ))}
            </tbody>
        </table>
    )
}

export default PermutationTable;
