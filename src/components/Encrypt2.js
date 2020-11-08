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

   generateKeys({ originalKey, PC1, PC2 }) {
      const N_ROUNDS = 16;
      const NUM_LHS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

      const keys = [];
      const initialPermutation = bitHandling.permutate(originalKey, PC1);
      let [left, right] = bitHandling.makeHalves(initialPermutation, 56);
      console.log(`Key: ${bitHandling.bitString(originalKey, 64)}`);
      console.log(`After Permutation: ${bitHandling.bitString(initialPermutation, 64)}`);
      console.log(`Left: ${bitHandling.bitString(left, 64)}`);
      console.log(`Right: ${bitHandling.bitString(right, 64)}`);

      for (let round = 0;round < N_ROUNDS;round++) {
         const shifts = NUM_LHS[round];
         const c = bitHandling.circularLeftShift(left, 28, shifts);
         const d = bitHandling.circularLeftShift(right, 28, shifts);

         const newKey = bitHandling.permutate(bitHandling.fromHalves(c, d, 28), PC2);
         console.log(`key ${round}: ${newKey} -  ${bitHandling.bitString(newKey, 64)}`);

         keys.push(newKey);
      }

      return keys;
   }

   addPadding(message){
      let paddedMessage = message;
      while (paddedMessage.length % 4 != 0){
         paddedMessage += ".";
      }
      return paddedMessage;
      
   }

   toBinary(message){
      return bitHandling.bitString(message, message*8);
   }

   DESRounds({input, keys}){
      
      //for 16
      console.log(`64 bit Block of Message: ${input}`);

      let [L0, R0] = bitHandling.makeHalves(input, 64);

      console.log(`Initial Left Half: ${bitHandling.bitString(L0, 32)}`);
      console.log(`Inital Rigth Half: ${bitHandling.bitString(R0, 32)}`);

      // Expand right size from 32 to 48 bits

      // XOR with subkey i

      // S-boxes to shrink from 48 to 32 bits

      // Permutation

      // XOR with left side

      // Assign to new right side
      let R1 = "";

      return bitHandling.fromHalves(R0, R1, 32);
   }

   // Encrypts 64 bit block
   encryptBlock({originalBinary, numBlocks, keys, IP}){

      const bits = 64;

      console.log(`Binary Message: ${originalBinary}`);
      console.log(`Binary Message By Bit: ${bitHandling.bitString(originalBinary, 64)}`);      

      let message = originalBinary;

      // 4 characters per block
      // each 64 bits of the message
      let output = 0;
      for (let blockNum = 0; blockNum < numBlocks; blockNum++){
         console.log(`start: ${blockNum*bits}`);
         console.log(`end: ${(blockNum+1)*bits}`);

         let [messageBlock, messageRemainder] = bitHandling.makeHalves(message, 128); 
         message = messageRemainder;
         console.log(`Encrypted Message round ${blockNum}: ${messageBlock}`);

         // Initial Permutation
         const initialPermutation = bitHandling.permutate(messageBlock, IP);
         const initialPermutationBits = bitHandling.bitString(initialPermutation, 64);

         console.log(`Initial Permutation: ${initialPermutation}`);
         console.log(`Initial Permutation: ${initialPermutationBits}`);
         console.log(`Initial Permutation Length: ${initialPermutationBits.length}`);

         // 16 DES Rounds
         const afterDESRounds = this.DESRounds({
            input: initialPermutation, 
            keys: keys
         });

         // Reverse left and right sides

         // Final Permutation
         const finalPermutation = bitHandling.permutate(afterDESRounds, IP);

         output = bitHandling.joinPieces(output, finalPermutation, 64);
      
         console.log(`Output: ${output}`);
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
      let binaryMessage = 0; 
      for (let i = 0; i < paddedMessage.length; i++) {
         binaryMessage = bitHandling.joinPieces(binaryMessage, paddedMessage.charCodeAt(i), 16);
      }

      console.log(`Original Message: ${this.state.plaintext}`);
      console.log(`Padded Message: ${paddedMessage}`);

      // Generate encrypted message
      const encryptedMessage = this.encryptBlock({
         originalBinary: binaryMessage,
         numBlocks: paddedMessage.length/4,
         keys: keys,
         IP: this.makePermutationTable(64, 64),
      }); 

      console.log(`Encrypted Message: ${encryptedMessage}`);

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
            <p>{this.state.result}</p>
            <br></br>
            <br></br>
            <br></br>
         </div>
      )
   }
}
export default Encrypt2;
