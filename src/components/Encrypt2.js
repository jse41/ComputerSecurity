import _ from 'lodash';
import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import bitHandling from '../bit-handling-2';

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt2 extends React.Component {

   constructor(props) {
      super(props);

      this.state = {
         isToggleOn: true,
         plaintext: "Hello world!",
         key: "xcdf",
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

   makeSBoxes() {
      // Obtained from: https://www.oreilly.com/library/view/computer-security-and/9780471947837/sec9.3.html
      const sBoxes = [];

      sBoxes[0] = [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,14];
      sBoxes[1] = [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9];
      sBoxes[2] = [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,13,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12];
      sBoxes[3] = [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14];
      sBoxes[4] = [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3];
      sBoxes[5] = [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13];
      sBoxes[6] = [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12];
      sBoxes[7] = [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11];

      /*
      // For the 8 S boxes
      for (let i = 0; i < 8; i++) {
         sBoxes[i] = []
         // For the 64 elements in each S box
         for (let j = 0; j < 64; j++) {
            sBoxes[i].push(Math.floor(Math.random() * 16));
         }
      }
      */
      return sBoxes;
   }

   generateKeys({ originalKey, PC1, PC2 }) {
      const N_ROUNDS = 16;
      const NUM_LHS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

      const keys = [];
      const initialPermutation = bitHandling.permutate(originalKey, PC1);
      let [left, right] = bitHandling.makeHalves(initialPermutation);

      for (let round = 0;round < N_ROUNDS;round++) {
         const shifts = NUM_LHS[round];
         left = bitHandling.circularLeftShift(left, shifts);
         right = bitHandling.circularLeftShift(right, shifts);

         const newKey = bitHandling.permutate(bitHandling.fromHalves(left, right), PC2);
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

   string2bin(message){
      let bin = "";
      for (let i = 0; i < message.length; i++) {
         bin += message.charCodeAt(i).toString(2).padStart(16,"0");
      }
      return bin;
   }

   bin2string(bin){
      let message = "";
      for (let i = 0; i < bin.length; i = i+16) {
         message += String.fromCharCode(parseInt(bin.substring(i, i+16),2));
      }
      return message;
   }

   hex2bin(hex){
      let bin = "";
      for (let i = 0; i < hex.length; i=i+4) {
         bin += parseInt(hex.substring(i, i+4),16).toString(2).padStart(16,"0");
      }
      return bin;
   }

   bin2hex(bin){
      let hex = "";
      for (let i = 0; i < bin.length; i = i+16) {
         hex += parseInt(bin.substring(i, i+16),2).toString(16).padStart(4,"0");
      }
      return hex;
   }

   DESRounds({input, keys, sBoxes, P}){
      // Does the 16 rounds of DES for a 64 bit block
      let [L, R] = bitHandling.makeHalves(input);
      console.log(`Before DES: ${L}  ${R}`)

      // Performs 16 rounds of DES
      for (let i = 0; i < 16; i++){

         // Expand right size from 32 to 48 bits
         const expansionPermutation = bitHandling.makePermutationTable(32, 48);
         const expandedR0 = bitHandling.permutate(R, expansionPermutation);

         // XOR with subkey i
         const xorWithKey = bitHandling.XOR(expandedR0, keys[i]);

         // S-boxes to shrink from 48 to 32 bits
         const sBoxBlock = this.sBoxBlock({
            bits: xorWithKey,
            sBoxes,
         });

         // Permutation
         const permutatedBlock = bitHandling.permutate(sBoxBlock, P);

         // XOR with left side
         const xorWithLeft = bitHandling.XOR(permutatedBlock, L);

         // Assign to new right side
         L = R;
         R = xorWithLeft;
      }

      console.log(`After DES: ${L}  ${R}`)
      return L + R;
   }

   encryptBlock({originalBinary, keys, sBoxes, IP, P, FP}){
      // Encrypts each 64 bit block
      const N_BITS = 64;
      let message = originalBinary;

      let output = "";

      for (let block of _.chunk(originalBinary, N_BITS).map(b => b.join(''))) {
         const initialPermutation = bitHandling.permutate(block, IP);

         // 16 DES Rounds
         const afterDESRounds = this.DESRounds({
            input: initialPermutation,
            keys: keys,
            sBoxes: sBoxes,
            P: P
         });
         console.log(`--------------------`);

         const test = this.DESRounds({
            input: afterDESRounds,
            keys: keys.reverse(),
            sBoxes: sBoxes,
            P: P
         });

         // Reverse left and right sides
         const reversedBlock = afterDESRounds.substring(N_BITS/2) + afterDESRounds.substring(0, N_BITS/2);

         // Final Permutation
         const finalPermutation = bitHandling.permutate(reversedBlock, FP);

         output += finalPermutation;
      }

      return output;
   }

   doEncryption() {

      // Generate the key
      let binaryKey = bitHandling.strToBits(this.state.key.substring(0, 4));;

      const keys = this.generateKeys({
         originalKey: binaryKey,
         PC1: bitHandling.makePermutationTable(64, 56),
         PC2: bitHandling.makePermutationTable(56, 48),
      });

      // Padding the plaintext message so that the message is composed of 64 bit sections (4 characters sections)
      const paddedMessage = this.addPadding(this.state.plaintext);

      // Generate the binary message
      const binaryMessage = bitHandling.strToBits(paddedMessage);

      console.log(`Original Message: ${this.bin2hex(binaryMessage)}`);

      const sBoxes = this.makeSBoxes();
      const IP =  bitHandling.makePermutationTable(64, 64);
      const P = bitHandling.makePermutationTable(54, 64);
      const FP = bitHandling.invertPermutationTable(IP);

      // Generate encrypted message
      const encryptedBinary = this.encryptBlock({
         originalBinary: binaryMessage,
         keys: keys,
         sBoxes: sBoxes,
         IP: IP,
         P: P,
         FP: FP
      });

      // Convert encrypted number to characters for the encrypted message
      let encryptedMessage = this.bin2hex(encryptedBinary)
      console.log(`Encrypted Message: ${encryptedMessage}`);

      this.setState({
         encryptedPlaintext: encryptedMessage
      })

      // Decrypt the encrypted message (temporarily placement in this method to check if it works)
      // Generate the binary message
      const encryptedBinaryMessage = this.hex2bin(encryptedMessage);

      // Generate encrypted message
      const decryptedNumber = this.encryptBlock({
         originalBinary: encryptedBinary,
         keys: keys.reverse(),
         sBoxes: sBoxes,
         IP: IP,
         P: P,
         FP: FP
      });

      // Convert encrypted number to characters for the encrypted message
      let dencryptedMessage = this.bin2hex(decryptedNumber)
      console.log(`Decrypted Message: ${dencryptedMessage}`);

      this.setState({
         decryptedCiphertext: dencryptedMessage
      })


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
            <p>The decrypted message:</p>
            <p>{this.state.decryptedCiphertext}</p>
            <br></br>
            <br></br>
            <br></br>
         </div>
      )
   }
}
export default Encrypt2;
