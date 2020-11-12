import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import bitHandling from '../bit-handling';

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt2 extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         isToggleOn: true,
         plaintext: "",
         key: "",
         encryptedPlaintext: "",
         ciphertext: "",
         decryptedCiphertext: ""
      }

      this.handleUpdate = this.handleUpdate.bind(this);
      this.doEncryption = this.doEncryption.bind(this);
   }

   handleUpdate(prop, e) {
      this.setState({ [prop]: e.target.value });
   }

   makePermutationTable(originalSize, tableSize) {
      const options = [];
      for (let i = 0;i < originalSize;i++) {
         options.push(i);
      }

      const table = [];

      for (let i = 0;i < tableSize;i++) {
         const randomIndex = Math.floor(Math.random() * options.length);
         table.push(options.splice(randomIndex, 1));
      }

      return table;
   }

   makeSBoxes() {
      const sBoxes = [];

      // For the 8 S boxes
      for (let i = 0; i < 8; i++) {
         sBoxes[i] = []
         // For the 64 elements in each S box
         for (let j = 0; j < 64; j++) {
            sBoxes[i].push(Math.floor(Math.random() * 16));
         }
      }
      return sBoxes;
   }

   generateKeys({ originalKey, PC1, PC2 }) {
      const N_ROUNDS = 16;
      const NUM_LHS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

      const keys = [];
      const initialPermutation = bitHandling.permutate(originalKey, PC1);
      let [left, right] = bitHandling.makeHalves(initialPermutation, 56);

      for (let round = 0;round < N_ROUNDS;round++) {
         const shifts = NUM_LHS[round];
         left = bitHandling.circularLeftShift(left, 28, shifts);
         right = bitHandling.circularLeftShift(right, 28, shifts);

         const newKey = bitHandling.permutate(bitHandling.fromHalves(left, right, 28), PC2);
         
         keys.push(newKey);
      }

      return keys;
   }

   addPadding(message){
      let paddedMessage = message;
      while (paddedMessage.length % 4 != 0){
         paddedMessage += " ";
      }
      return paddedMessage;
      
   }

   xorBlock({inputA , inputB, N_BITS}){
      let xorOutput = "";
      for (let i = 0; i < N_BITS; i++){
         xorOutput = bitHandling.setBit(xorOutput, i, bitHandling.getBit(inputA, i) ^ bitHandling.getBit(inputB, i));
      }

      return bitHandling.bitString(xorOutput, N_BITS);
   }

   permutate(bits, table) {
      let output = "";
      for (let i = 0; i < table.length; i++) {
          output += bits.charAt(table[i]);
      }
      return output;
  }

   sBoxBlock({bits, sBoxes}){
      let output = "";
      for (let i = 0; i < 8; i++){
         const box = sBoxes[i];
         const section = bits.substring(i, i+6);
         const row = parseInt(section.charAt(0) + section.charAt(5), 2);
         const col = parseInt(section.substring(1,5), 2);
         const newEntry = sBoxes[i][16*row + col];
         output += newEntry.toString(2).padStart(4, "0");
      }
      return output;
   }

   DESRounds({input, keys, sBoxes, perm}){
      // Does the 16 rounds of DES for a 64 bit block
      const N_ROUNDS = 16;
      let L = input.substring(0, 32);
      let R = input.substring(32);

      // Performs 16 rounds of DES
      for (let i = 0; i < N_ROUNDS; i++){

         // Expand right size from 32 to 48 bits
         const expansionPermutation = this.makePermutationTable(32, 48);
         const expandedR0 = this.permutate(R, expansionPermutation);

         // XOR with subkey i
         const xorWithKey = this.xorBlock({
            inputA: parseInt(expandedR0, 2), 
            inputB: keys[i],
            N_BITS: expandedR0.length});

         // S-boxes to shrink from 48 to 32 bits
         const sBoxBlock = this.sBoxBlock({
            bits: xorWithKey, 
            sBoxes: sBoxes});

         // Permutation
         const permutatedBlock = this.permutate(sBoxBlock, perm);

         // XOR with left side
         const xorWithLeft = this.xorBlock({
            inputA: parseInt(permutatedBlock, 2), 
            inputB: parseInt(L, 2),
            N_BITS: 32});


         // Assign to new right side
         L = R;
         R = xorWithLeft;
      }

      return L + R;
   }

   encryptBlock({originalBinary, keys, sBoxes, IP, P, FP}){
      // Encrypts each 64 bit block
      const N_BITS = 64;
      let message = originalBinary;

      let output = "";
      for (let blockNum = 0; blockNum < originalBinary.length/N_BITS; blockNum++){
         let messageBlock = message.substring(blockNum, blockNum+N_BITS);
         message = message.substring(blockNum+N_BITS);

         // Initial Permutation 
         const initialPermutation = this.permutate(messageBlock, IP);

         // 16 DES Rounds
         const afterDESRounds = this.DESRounds({
            input: initialPermutation, 
            keys: keys,
            sBoxes: sBoxes,
            perm: P
         });

         // Reverse left and right sides
         const reversedBlock = afterDESRounds.substring(N_BITS/2) + afterDESRounds.substring(0, N_BITS/2);

         // Final Permutation
         const finalPermutation = this.permutate(reversedBlock, FP);

         output += finalPermutation;
      }

      return output;
   }

   doEncryption() {

      // Generate the key
      let binaryKey = 0;

      for (let i = 0; i < Math.min(this.state.key.length, 4); i++) {
         binaryKey = bitHandling.joinPieces(binaryKey, this.state.key.charCodeAt(i), 16);
      }

      const keys = this.generateKeys({
         originalKey: binaryKey,
         PC1: this.makePermutationTable(64, 56),
         PC2: this.makePermutationTable(64, 56),
      });


      // Padding the plaintext message so that the message is composed of 64 bit sections (4 characters sections)
      let paddedMessage = this.addPadding(this.state.plaintext);

      // Generate the binary message
      let binaryMessage = ""; 
      for (let i = 0; i < paddedMessage.length; i++) {
         binaryMessage += paddedMessage.charCodeAt(i).toString(2).padStart(16,"0"); 
      }

      // Generate encrypted message
      const encryptedNumber = this.encryptBlock({
         originalBinary: binaryMessage,
         keys: keys,
         sBoxes: this.makeSBoxes(),
         IP: this.makePermutationTable(64, 64),
         P: this.makePermutationTable(64, 64),
         FP: this.makePermutationTable(64, 64),
      }); 

      let encryptedMessage = ""; 
      for (let i = 0; i < encryptedNumber.length; i = i+16) {
         encryptedMessage += String.fromCharCode(parseInt(encryptedNumber.substring(i, i+16),2));
      }
      // Convert encrypted number to characters for the encrypted message
      //const encryptedMessage = this.binary2Char(encryptedNumber, paddedMessage.length/4);
      console.log(`Encrypted Message: ${encryptedMessage}`);

      //this.handleUpdate.bind(encryptedMessage, 'encryptedPlaintext');
      this.setState({
         encryptedPlaintext: encryptedMessage
      })
      //this.state.encryptedPlaintext = encryptedMessage;
   }

   doDecryption() {
   }

   render() {
      return (
         <div>
            <Alert />
            <Nav />
            <h1>DES</h1>
            <Form>
               <Form.Group controlId="EncryptUpdate">
                  <Form.Label>Message</Form.Label>
                  <Form.Control type="text" value={this.state.plaintext} onChange={this.handleUpdate.bind(this, 'plaintext')} placeholder="Message to Encrypt" />
                  <Form.Text className="text-muted">
                     This is the plain text information you want to share.
                  </Form.Text>
               </Form.Group>
               <Form.Group controlId="KeyControl">
                  <Form.Label>Key</Form.Label>
                  <Form.Control type="text" value={this.state.key}  onChange={this.handleUpdate.bind(this, 'key')} placeholder="Key to Use" />
                  <Form.Text className="text-muted">
                     The key to use (any string of 4 characters)
                  </Form.Text>
               </Form.Group>
            <Button variant="primary" onClick={this.doEncryption}>
               Encrypt
            </Button>
            </Form>
            <br></br>
            <p>Your encrypted message:</p>
            <p>{this.state.encryptedPlaintext}</p>
            <br></br>
            <br></br>
            <br></br>
         </div>
      )
   }
}
export default Encrypt2;
