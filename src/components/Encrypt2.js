import _ from 'lodash';
import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Collapsible from 'react-collapsible';
import bitHandling from '../bit-handling-2';
import {DESRounds} from './DES';

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
         decryptedCiphertext: "",
         setValues: true,
         keys: [],
         first64BitBlock: "",
         first64Bits: "",
         IP: [],
         afterInitialPermutation: "",
         L0: "",
         R0: "",
         expansionBox: [],
         afterExpansionBox: "",
         afterXorWithKey: "",
         sBox: [],
         afterSBox: "",
         permutationBox: [],
         afterPermutation: "",
         L1: "",
         R1: ""
      }

      this.handleUpdate = this.handleUpdate.bind(this);
      this.doEncryption = this.doEncryption.bind(this);
   }

   handleUpdate(prop, e) {
      this.setState({ [prop]: e.target.value });
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
      while (paddedMessage.length % 4 !== 0){
         paddedMessage += " ";
      }
      return paddedMessage;
   }

   encryptBlock({originalBinary, keys, IP, P, P2, FP}){
      // Encrypts each 64 bit block
      const N_BITS = 64;
      let output = "";
      let firstRound = true;

      for (let block of _.chunk(originalBinary, N_BITS).map(b => b.join(''))) {
         const initialPermutation = bitHandling.permutate(block, IP);

         // 16 DES Rounds
         const afterDESRounds = DESRounds({
            input: initialPermutation,
            keys,
            P,
            P2,
         });

         console.log(`--------------------`);

         const test = DESRounds({
            input: afterDESRounds,
            keys: keys.reverse(),
            P,
            P2,
         });

         const finalPermutation = bitHandling.permutate(afterDESRounds, FP);
         output += finalPermutation;

         if (this.state.setValues && firstRound){
            this.setState({
               first64Bits: block,
               afterInitialPermutation: initialPermutation
            })
         }
         firstRound = false;
      }

      return output;
   }

   doEncryption() {
      this.setState({
         setValues: true
      })

      // Generate the key
      let binaryKey = bitHandling.strToBits(this.state.key.substring(0, 4));

      const keys = this.generateKeys({
         originalKey: binaryKey,
         PC1: bitHandling.makePermutationTable(64, 56),
         PC2: bitHandling.makePermutationTable(56, 48),
      });

      // Padding the plaintext message so that the message is composed of 64 bit sections (4 characters sections)
      const paddedMessage = this.addPadding(this.state.plaintext);

      // Generate the binary message
      const binaryMessage = bitHandling.strToBits(paddedMessage);

      console.log(`Original Message: ${this.bitsToHex(binaryMessage)}`);

      const IP =  bitHandling.makePermutationTable(64, 64);
      const P = bitHandling.makePermutationTable(32, 32);
      const P2 = bitHandling.makePermutationTable(32, 48);
      const FP = bitHandling.invertPermutationTable(IP);

      // Generate encrypted message
      const encryptedBinary = this.encryptBlock({
         originalBinary: binaryMessage,
         keys,
         IP,
         P,
         P2,
         FP,
      });

      // Convert encrypted number to characters for the encrypted message
      let encryptedMessage = this.bitsToHex(encryptedBinary)
      console.log(`Encrypted Message: ${encryptedMessage}`);

      this.setState({
         encryptedPlaintext: encryptedMessage,
         setValues: false,
         keys: keys,
         first64BitBlock: paddedMessage.substring(0,4),
         IP: IP,
         P: P,
         P2: P2,

      })

      this.doDecryption({
         cipherbits: encryptedBinary,
         keys,
         IP,
         P,
         P2,
         FP,
      });
      //
      // // Convert encrypted number to characters for the encrypted message
      // let decryptedMessage = bitHandling.bitsToHex(decryptedNumber)
      //
      // this.setState({
      //    decryptedCiphertext: decryptedMessage
      // })
      //

   }

   doDecryption({ cipherbits, keys, IP, FP, P, P2, sBoxes }) {
      const preFinal = bitHandling.permutate(cipherbits, IP);
      const swapped = bitHandling.swapHalves(preFinal);
      const preDecryption = bitHandling.permutate(swapped, FP);

      const decryptedBinary = this.encryptBlock({
         originalBinary: preDecryption,
         keys: keys.reverse(),
         sBoxes,
         IP,
         P,
         P2,
         FP,
      });

      const decryptedMessage = this.bitsToHex(decryptedBinary);
      console.log(`Decrypted Message: ${decryptedMessage}`);
      this.setState({
         decryptedCiphertext: decryptedMessage,
      })
   }

hexToBits(hex){
   let bits = "";
   for (let i = 0; i < hex.length; i=i+4) {
      bits += parseInt(hex.substring(i, i+4),16).toString(2).padStart(16,"0");
   }
   return bits;
}

bitsToHex(bits){
   let hex = "";
   for (let i = 0; i < bits.length; i = i+16) {
      hex += parseInt(bits.substring(i, i+16),2).toString(16).padStart(4,"0");
   }
   return hex;
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
            <h3>Key Generation</h3>
            <p>Key 1: {this.state.keys[0]}</p>
            <p>Key 2: {this.state.keys[1]}</p>
            <br></br>
            <h3>Encryption</h3>
            <p>Original Message: {this.state.plaintext}</p>
            <p>First 64 Bits of Message: {this.state.first64BitBlock}</p>
            <p>Bits of First Block: {this.state.first64Bits}</p>
            <br></br>
            <h5>Initial Permutation</h5>
            <p>Permutation Table: {this.state.IP}</p>
            <p>Permutation is the act of mapping with input bit to a new output position. In this permutation, the input is 64 bits and the output is 64 bits, no bits
                     are lost or created, instead each and every bit is mapped to a single new location. For example, since the first entry in the permutation table is 
                     {this.state.IP[0]}, the bit at that index in the input becomes the first bit of the output.</p>
            <p>After Permutating: {this.state.afterInitialPermutation}</p>
            <h5>DES Rounds</h5>
            <p>L0: {this.state.L0}</p>
            <p>R0: {this.state.R0}</p>
            <p>Insert latex equation</p>
            <Collapsible trigger="f Function">
               <p>Overview of f function</p>
               <p>Expansion Box: {this.state.expansionBox}</p>
               <p>After Expansion: {this.state.afterExpansionBox}</p>
               <p>XOR with the key:</p>
               <p>Key: {this.state.keys[0]}</p>
               <p>After XOR: {this.state.afterXorWithKey}</p>
               <Collapsible trigger="S Boxes">
                  <p>First 6 bits of input: {this.state.afterXorWithKey.substring(0,6)}</p>
                  <p>Row (formed with the first and last bit of the input): {this.state.afterXorWithKey.charAt(0)+ this.state.afterXorWithKey.charAt(5)}</p>
                  <p>Column (formed with the middle 4 bits of the input): {this.state.afterXorWithKey.substring(1,5)}</p>
                  <p>Using the row and column calculated above, the corresponding table entry at that location is the new output.</p>
               </Collapsible>
               <p>After Permutation: {this.state.afterPermutation}</p>
            </Collapsible>
            <br></br>
            <hr></hr>
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
