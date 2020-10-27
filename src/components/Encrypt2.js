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

      for (let round = 0;round < N_ROUNDS;round++) {
         const shifts = NUM_LHS[round];
         const c = bitHandling.circularLeftShift(left, 28, shifts);
         const d = bitHandling.circularLeftShift(right, 28, shifts);

         const newKey = bitHandling.permutate(bitHandling.fromHalves(c, d, 28), PC2);
         keys.push(newKey);
      }

      return keys;
   }

   key(){
      return "";
   }

   substitution(text){
      return text;
   }

   transposition(text){
      return text;
   }

   initialPermutation(text){
      return text;
   }

   finalPermutation(text){
      return text;
   }

   addPadding(text){
      return text;
   }

   encrypt(message, key) {
      const keys = this.generateKeys({
         originalKey: key,
         PC1: this.makePermutationTable(64, 56),
         PC2: this.makePermutationTable(64, 56),
      });

      const bits = 64;
      //56 bit key
      //const key = this.key();
      let blockNum = 0;

      const paddedMessage = this.addPadding(message);
      //const length = paddedMessage.length;

      console.log(`Entire Message: ${message}`);
      console.log(`Padded Message: ${paddedMessage}`);

      //while (blockNum*bits < length){
         const messageBlock = message.substring(blockNum*bits, (blockNum+1)*bits);
         console.log(`64 bit Block of Message: ${messageBlock}`);

         const IPMessage = this.initialPermutation(message);

         const L0 = IPMessage.substring(0, IPMessage.length/2);
         const R0 = IPMessage.substring(IPMessage.length/2);

         console.log(`Initial Left Half: ${L0}`);
         console.log(`Inital Rigth Half: ${R0}`);

         blockNum++;
      //}
   }

   decrypt(message) {
      return message;
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
                     The key to use (any string of 8 characters)
                  </Form.Text>
               </Form.Group>
            <Button variant="primary">
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
