const DES = require('./DES');


it('sBoxBlock', () => {
    const sBoxes = [];
    const box = [];
    for (var i = 0; i < 64; i++) {
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

    let exceptedOutput = "";
    exceptedOutput += (16*2 + 5).toString(2).padStart(4, "0");
    exceptedOutput += (16*2 + 8).toString(2).padStart(4, "0");
    exceptedOutput += (16*1 + 10).toString(2).padStart(4, "0");
    exceptedOutput += (16*0 + 15).toString(2).padStart(4, "0");
    exceptedOutput += (16*3 + 0).toString(2).padStart(4, "0");
    exceptedOutput += (16*3 + 4).toString(2).padStart(4, "0");
    exceptedOutput += (16*1 + 8).toString(2).padStart(4, "0");
    exceptedOutput += (16*0 + 0).toString(2).padStart(4, "0");

    expect(DES.sBoxBlock({bits, sBoxes})).toEqual(exceptedOutput);
})
