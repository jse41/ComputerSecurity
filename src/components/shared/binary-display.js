import _ from 'lodash';
import React from 'react';
import Latex from 'react-latex';

class BinaryDisplay extends React.Component {
    render() {
        const binary = this.props.bits || '';
        const chunkSize = this.props.chunkSize || binary.length;
        const chunked = _.chunk(binary.split(''), chunkSize).map(bits => bits.join('')).join(' ');
        const style = _.merge({}, { fontFamily: 'monospace', fontSize: '1.2rem' }, this.props.style);
        return (
            <div style={{ wordBreak: 'break-word' }}>
                {this.props.label &&
                    <Latex>{this.props.label}</Latex>}
                    {this.props.label && ': '}
                    <span style={style}>{chunked}</span>
            </div>
        );
    }
}

export default BinaryDisplay;
