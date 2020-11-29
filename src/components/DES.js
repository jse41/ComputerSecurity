import bitHandling from '../bit-handling-2';
const _ = require('lodash');


const sBoxes = getSBoxes();
const expansionBox = getExpansionBox();

function getSBoxes() {
    // Obtained from: https://www.oreilly.com/library/view/computer-security-and/9780471947837/sec9.3.html
    // and https://www.nku.edu/~christensen/DESschneier.pdf
    const sBoxes = [];
    sBoxes[0] = [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,
                 0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,
                 4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,
                 15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,14];
    sBoxes[1] = [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,
                 3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,
                 0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,
                 13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9];
    sBoxes[2] = [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,
                 13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,
                 13,6,4,9,8,15,3,0,11,1,2,13,5,10,14,7,
                 1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12];
    sBoxes[3] = [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,
                 13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,
                 10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,
                 3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14];
    sBoxes[4] = [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,
                 14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,
                 4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,
                 11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3];
    sBoxes[5] = [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,
                 10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,
                 9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,
                 4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13];
    sBoxes[6] = [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,
                 13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,
                 1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,
                 6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12];
    sBoxes[7] = [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,
                 1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,
                 7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,
                 2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11];
    return sBoxes;
 }

 function getExpansionBox(bits){
    return [31,0,1,2,3,4,3,4,5,6,7,8,7,
        8,9,10,11,12,11,12,13,14,15,16,15,
        16,17,18,19,20,19,20,21,22,23,24,23,
        24,25,26,27,28,27,28,29,30,31,0];
}

function sBoxBlock({bits, sBoxes}){
    let output = "";
    for (let i = 0; i < 8; i++){
       const section = bits.substring(6*i, 6*i+6);
       const row = parseInt(_.at(section,0) + _.at(section,5), 2);
       const col = parseInt(section.substring(1,5), 2);
       const newEntry = sBoxes[i][16*row + col];
       output += newEntry.toString(2).padStart(4, "0");
    }
    return output;
 }

 function round({L, R, i, keys, P}){
     // Expand right size from 32 to 48 bits
     const expandedR0 = bitHandling.permutate(R, expansionBox);

     // XOR with sub-key i
     const xorWithKey = bitHandling.XOR(expandedR0, keys[i]);

     // S-boxes to shrink from 48 to 32 bits
     const afterSBox = sBoxBlock({
         bits: xorWithKey,
         sBoxes,
     });

     // Permutation
     const permutatedBlock = bitHandling.permutate(afterSBox, P);

     // XOR with left side
     const xorWithLeft = bitHandling.XOR(permutatedBlock, L);

     // Assign to new right side
     return xorWithLeft;
 }

function DESRounds({ input, keys, P, displayValuesCallback }){

    // Does the 16 rounds of DES for a 64 bit block
    let [L, R] = bitHandling.makeHalves(input);
    const displayValues = [[L, R]];

    // Performs 16 rounds of DES
    for (let i = 0; i < 16; i++){
       [L, R] = [R, round({L, R, i, keys, P})];
       displayValues.push([L, R]);
    }

    displayValuesCallback(displayValues);

    return R + L;
 }

export {DESRounds, sBoxBlock, round, expansionBox, sBoxes};
