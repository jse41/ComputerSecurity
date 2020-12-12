import bitHandling from "../bit-handling-2";
const DES = require('./DES');


it('sBoxBlock', () => {
    const sBoxes = [];
    const box = [];
    for (let i = 0; i < 64; i++) {
        box.push(i);
    }
    sBoxes.push(box, box, box, box, box, box, box, box);

    let bits = "";
    bits += '101010'; //row = 2, col = 5
    bits += '110000'; //row = 2, col = 8
    bits += '010101'; //row = 1, col = 10
    bits += '011110'; //row = 0, col = 15
    bits += '100001'; //row = 3, col = 0
    bits += '101001'; //row = 3, col = 4
    bits += '010001'; //row = 1, col = 8
    bits += '000000'; //row = 0, col = 0

    let expectedOutput = "";
    expectedOutput += (16*2 + 5).toString(2).padStart(4, "0");
    expectedOutput += (16*2 + 8).toString(2).padStart(4, "0");
    expectedOutput += (16*1 + 10).toString(2).padStart(4, "0");
    expectedOutput += (16*0 + 15).toString(2).padStart(4, "0");
    expectedOutput += (16*3 + 0).toString(2).padStart(4, "0");
    expectedOutput += (16*3 + 4).toString(2).padStart(4, "0");
    expectedOutput += (16*1 + 8).toString(2).padStart(4, "0");
    expectedOutput += (16*0 + 0).toString(2).padStart(4, "0");

    expect(DES.sBoxBlock({bits, sBoxes})).toEqual(expectedOutput);
})

it('DESRounds', () => {
    const keys = ["010011110000000000101000000000110000100000000111", "010000001010010000000000010000101000010100001010", "100000000101010001001100001100000000010000000010", "000000000000001100000110001000000000100011100100", "001000100010100010101000000000001000001000100000", "010110010010000100001000100100000101000000000010", "010001000000011110011001001101000000000000001000", "001000000100011110000000000010000011010000000001", "000000010100000010110000000001000010100011100110", "000010101000100000100001001000000011001011000000", "010110101000000001100000100011000100000000011000", "000011000010010001010000010001010100010000000100", "000000000101000000000100000101100010001000010101", "000100001100001000000010000000010000001110110000", "101101000000000001100000000000111000000011010000", "010000000000010000000010000010011111000000001001"];
    const P = [15, 6, 19, 20, 28, 11, 27, 16, 0, 14, 22, 25, 4, 17, 30, 9, 1, 7, 23, 13, 31, 26, 2, 8, 18, 12, 29, 5, 21, 10, 3, 24];
    let bits = "";
    bits += '10101101';
    bits += '11000100';
    bits += '01010001';
    bits += '01111110';
    bits += '10000010';
    bits += '10101000';
    bits += '01001101';
    bits += '00000001';

    const afterDES = DES.DESRounds({
        input: bits,
        keys,
        P,
    });

    const decryptedBits = DES.DESRounds({
        input: afterDES,
        keys: keys.reverse(),
        P,
    });

    expect(decryptedBits).toEqual(bits);
})

it('IP-FP reversible', () => {
    const IP = [57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
                56, 48, 40, 32, 24, 16, 8, 0, 58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6];
    const FP = [39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28,
                35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25, 32, 0, 40, 8, 48, 16, 56, 24];

    let bits = '1010110111000100010100010111111010000010101010000100110100000001';

    const afterIP = bitHandling.permutate(bits, IP);
    const afterFP = bitHandling.permutate(afterIP, FP);

    expect(afterFP).toEqual(bits);
})