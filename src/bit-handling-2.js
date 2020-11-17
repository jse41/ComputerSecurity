const _ = require('lodash');
const { bitString } = require('./bit-handling');

/**
 * Converts a string of text to a string of bits
 * @param {string} str Any text
 * @return {string} The charCodes of the characters in base 2
 */
function strToBits(str) {
    let bits = '';
    for (let i = 0;i < str.length;i++) {
        bits += bitString(str.charCodeAt(i), 16).padStart(16, '0');
    }
    return bits;
}

/**
 * Converts a string of bits back to text
 * @param {string} bits Char codes
 * @return {string} The text string corresponding to those character codes
 */
function bitsToStr(bits) {
    const charCodes = _.chunk(bits.split(''), 16).map(chunks => chunks.join(''));
    return String.fromCharCode(...charCodes.map(code => parseInt(code, 2)));
}

/**
 * Gets the value of the bit at the specified index
 * @param {string} binary The binary string representation
 * @param {number} index The index of the bit to get (zero is rightmost bit)
 * @returns {number} The value of the specified bit
 */
function getBit(binary, index) {
    const i = binary.length - index - 1;
    return parseInt(binary.charAt(i));
}

/**
 * Set the value of the bit at the specified index to `value`
 * @param {string} original The original bit string
 * @param {number} index The index of the bit to set (zero is rightmost)
 * @param {number} value The value to set the bit to
 * @returns {string} The new bitstring, with the appropriate bit set
 */
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

/**
 * Perform a circular left shift on a binary number
 * @param {string} original The original bitstring
 * @param {number} amount The number of left shifts
 * @return {string} The shifted bitstring
 */
function circularLeftShift(original, amount) {
    if (amount < 0) throw new Error('amount must be non-negative');
    amount = amount % original.length;
    if (amount === 0) return original;

    return original.substring(amount) + original.substring(0, amount);
}

/**
 * Apply a permutation to a binary string, and return the result
 * @param {string} bits The original bits
 * @param {number[]} table The permutation table
 * @return {string} The permuted result
 */
function permutate(bits, table) {
    return table.map(i => getBit(bits, bits.length - i - 1)).join('');
}

function makeHalves(bits) {
    const length = Math.round(bits.length / 2);
    return [bits.substring(0, length), bits.substring(length)];
}

function swapHalves(bits) {
    const [R, L] = makeHalves(bits);
    return fromHalves(L, R);
}

function joinPieces(left, right) {
    return left + right;
}

function fromHalves(left, right) {
    return joinPieces(left, right);
}

function makePermutationTable(originalSize, permutedSize) {
    const options = [];
    const extraOptions = [];
    for (let i = 0;i < originalSize;i++) options.push(i);

    if (permutedSize > originalSize) {
        for (let i = 0;i < permutedSize - originalSize;i++) {
            extraOptions.push(options[Math.floor(Math.random() * options.length)]);
        }

        options.push(...extraOptions);
    }

    const table = [];
    for (let i = 0;i < permutedSize;i++) {
        const randomIndex = Math.floor(Math.random() * options.length);
        table.push(options.splice(randomIndex, 1)[0]);
    }

    return table;
}

// Not sure this works
function invertPermutationTable(table) {
    const ignore = new Set();
    const inverted = [];

    for (let i = 0;i < table.length;i++) {
        if (ignore.has(table[i])) continue;
        ignore.add(table[i]);
        inverted[table[i]] = i;
    }

    return inverted;
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
    permutate,
    makeHalves,
    swapHalves,
    joinPieces,
    fromHalves,
    makePermutationTable,
    invertPermutationTable,
};
