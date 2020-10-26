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
    const shifted = original << 1;
    const circularShifted = setBit(shifted, 0, leftMostBit);
    return circularLeftShift(circularShifted, size, amount - 1);
}

module.exports = {
    getBit,
    setBit,
    circularLeftShift,
}
