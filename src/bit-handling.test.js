const bitHandling = require('./bit-handling');

it('getBit gets the expected bit', () => {
    const original = 0b0101010;
    expect(bitHandling.getBit(original, 2)).toEqual(0);
    expect(bitHandling.getBit(original, 3)).toEqual(1);
})

it('setBit sets the expected bit', () => {
    const original = 0b0100;

    expect(bitHandling.setBit(original, 0, 1)).toEqual(5);
    expect(bitHandling.setBit(original, 2, 0)).toEqual(0);
    expect(bitHandling.setBit(original, 3, 1)).toEqual(12);
})

it('circularLeftShift works correctly', () => {
    const original = 0b1010001;
    const shifted1 = 0b0100011;
    const shifted3 = 0b0001101;

    expect(bitHandling.circularLeftShift(original, 7, 1)).toEqual(shifted1);
    expect(bitHandling.circularLeftShift(original, 7, 3)).toEqual(shifted3);
})

it('permutate works correctly', () => {
    const original = 0b010001000;
    const result_1 = 0b000110000;
    const result_2 = 0b000100000;

    const table_1 = [0, 1, 2, 4, 7, 3, 5, 6, 8];
    const table_2 = [0, 4, 2, 1, 5, 3];

    expect(bitHandling.permutate(original, table_1)).toEqual(result_1);
    expect(bitHandling.permutate(original, table_2)).toEqual(result_2);
})
