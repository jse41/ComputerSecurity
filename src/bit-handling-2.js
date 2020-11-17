const _ = require('lodash');
const { bitString } = require('./bit-handling');

function strToBits(str) {
    let bits = '';
    for (let i = 0;i < str.length;i++) {
        bits += bitString(str.charCodeAt(i), 16);
    }
    return bits;
}

function bitsToStr(bits) {
    const charCodes = _.chunk(bits.split(''), 16).map(chunks => chunks.join(''));
    return String.fromCharCode(...charCodes.map(code => parseInt(code, 2)));
}

function getBit(binary, index) {
    const i = binary.length - index - 1;
    return parseInt(binary.charAt(i));
}

function setBit(original, index, value) {
    const i = original.length - index - 1;
    return `${original.substring(0, i)}${value}${original.substring(i + 1)}`;
}

function AND(a, b) {
    const l = Math.max(a.length, b.length);
    a = a.padStart(l, '0');
    b = b.padStart(l, '0');
    let out = '';

    for (let i = 0;i < l;i++) {
        if (a.charAt(i) === '0' || b.charAt(i) === '0') {
            out += '0';
        } else {
            out += '1';
        }
    }

    return out;
}

function OR(a, b) {
    const l = Math.max(a.length, b.length);
    a = a.padStart(l, '0');
    b = b.padStart(l, '0');
    let out = '';

    for (let i = 0;i < l;i++) {
        if (a.charAt(i) === '1' || b.charAt(i) === '1') {
            out += '1';
        } else {
            out += '0';
        }
    }

    return out;
}

function XOR(a, b) {
    const l = Math.max(a.length, b.length);
    a = a.padStart(l, '0');
    b = b.padStart(l, '0');
    let out = '';

    for (let i = 0;i < l;i++) {
        if (a.charAt(i) !== b.charAt(i)) {
            out += '1';
        } else {
            out += '0';
        }
    }

    return out;
}

function leftShift(original, amount) {
    return original + '0'.repeat(amount);
}

function circularLeftShift(original, amount) {
    if (amount < 0) throw new Error('amount must be non-negative');
    amount = amount % original.length;
    if (amount === 0) return original;

    return original.substring(amount) + original.substring(0, amount);
}

module.exports = {
    strToBits,
    bitsToStr,
    getBit,
    setBit,
    AND,
    OR,
    XOR,
    leftShift,
    circularLeftShift,
};
