// eslint-disable-next-line no-unused-vars
function bitString(bits, size) {
    let string = '';
    for (let i = 0;i < size; i++) {
        string = getBit(bits, i) + string;
    }
    return string;
}

/**
 * Gets the value of the bit at the specified index
 * @param {number} binary - The binary number
 * @param {number} index - The index of the bit to get (zero is rightmost bit)
 * @returns {number} The value of the specified bit
 */
function getBit(binary, index) {
    const selectionMask = 1 << index;
    const overlapMask = binary & selectionMask;
    return overlapMask >>> index;
}

/**
 * Set the value of the bit at the specified index to `value`
 * @param {number} original - The original number
 * @param {number} index - The index of the bit to set (zero is rightmost)
 * @param {number} value - The value to set the bit to
 * @returns {number} The new binary, with the appropriate bit set
 */
function setBit(original, index, value) {
    const selectionMask = 1 << index;

    if (value === 1) {
        return original | selectionMask;
    } else {
        return original & ~selectionMask;
    }
}

/**
 * Perform a circular left shift on a binary number
 * @param {number} original - The original number
 * @param {number} size - The number of bits you are working with
 * @param {number} amount - The number of left shifts
 */
function circularLeftShift(original, size, amount) {
    if (amount < 0) throw new Error('amount must be non-negative');
    if (amount === 0) return original;

    const leftMostBit = getBit(original, size - 1);
    let shifted = original << 1;
    shifted = setBit(shifted, size, 0); // Clear the shifted bit
    shifted = setBit(shifted, 0, leftMostBit); // Wrap it around
    return circularLeftShift(shifted, size, amount - 1);
}

/**
 * Apply a permutation to a binary number, and return the result
 * @param {number} bits - The original bits
 * @param {number[]} table - The permutation table
 */
function permutate(bits, table) {
    let number = 0;

    for (let i = 0; i < table.length; i++) {
        const movingValue = getBit(bits, table[i]);
        number = setBit(number, i, movingValue);
    }

    return number;
}

function makeHalves(bits, length) {
    const leftMask = ~0b0 << (length / 2);
    const rightMask = ~leftMask;
    const leftHalf = (leftMask & bits) >>> (length / 2);
    const rightHalf = rightMask & bits;
    return [leftHalf, rightHalf];
}

function fromHalves(left, right, eachHalf) {
    return (left << eachHalf) | right;
}

module.exports = {
    getBit,
    setBit,
    circularLeftShift,
    permutate,
    makeHalves,
    fromHalves,
}
