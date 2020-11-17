const bitHandling2 = require('./bit-handling-2');

it('strToBits <-> bitsToStr', () => {
    const original = 'abc123';
    const bits = bitHandling2.strToBits(original);
    const returned = bitHandling2.bitsToStr(bits);
    const bits2 = bitHandling2.strToBits(returned);

    expect(original).toEqual(returned);
    expect(bits).toEqual(bits2);
});

it('get and set', () => {
    const bits = '0101100011';
    expect(bitHandling2.getBit(bits, 0)).toEqual(1);
    expect(bitHandling2.getBit(bits, 2)).toEqual(0);
    expect(bitHandling2.getBit(bits, 5)).toEqual(1);
})

it('and', () => {
    const one = '10101010';
    const two = '11100011';
    const three = '111';

    expect(bitHandling2.AND(one, two)).toEqual('10100010');
    expect(bitHandling2.AND(two, three)).toEqual('00000011');
})

it('or', () => {
    const one = '10101010';
    const two = '11100011';
    const three = '111';

    expect(bitHandling2.OR(one, two)).toEqual('11101011');
    expect(bitHandling2.OR(two, three)).toEqual('11100111');
})

it('xor', () => {
    const one = '10101010';
    const two = '11100011';
    const three = '111';

    expect(bitHandling2.XOR(one, two)).toEqual('01001001');
    expect(bitHandling2.XOR(two, three)).toEqual('11100100');
})

it('leftShift', () => {
    expect(bitHandling2.leftShift('001001', 2)).toEqual('00100100');
})

it('circularLeftShift', () => {
    const original = '1000100';
    const after1 = '0001001';
    const after3 = '0100100';
    const after5 = '0010001';
    const after8 = '0001001';

    expect(bitHandling2.circularLeftShift(original, 1)).toEqual(after1);
    expect(bitHandling2.circularLeftShift(original, 3)).toEqual(after3);
    expect(bitHandling2.circularLeftShift(original, 5)).toEqual(after5);
    expect(bitHandling2.circularLeftShift(original, 8)).toEqual(after8);
})

it('permutate', () => {
    const original = '010001000';
    const result_1 = '000110000';
    const result_2 = '100000';

    const table_1 = [0, 1, 2, 4, 7, 3, 5, 6, 8];
    const table_2 = [0, 4, 2, 1, 5, 3];

    expect(bitHandling2.permutate(original, table_1)).toEqual(result_1);
    expect(bitHandling2.permutate(original, table_2)).toEqual(result_2);
})

it('makeHalves', () => {
    const original = '0010011111';
    expect(bitHandling2.makeHalves(original)).toEqual(expect.arrayContaining(['00100', '11111']));
})
