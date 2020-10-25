import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt2 extends React.Component {
   
   constructor(props) {
      super(props);
      this.state = {
         isToggleOn: true,
         plaintext: "",
         encryptedPlaintext: "",
         ciphertext: "",
         decryptedCiphertext: ""
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleFormUpdate = this.handleFormUpdate.bind(this);
   }

   handleSubmit() {
      this.setState({result: this.encrypt(this.state.plaintext)});
   }

   
   handleFormUpdate(e) {
      console.log("handle form update");
      if(e.target.id === "EncryptUpdate") {
         this.setState({plaintext: e.target.value});
      }
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

   encrypt(message) {
      
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
            <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="EncryptUpdate">
               <Form.Label>Message</Form.Label>
               <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Message to Encrypt" />
               <Form.Text className="text-muted">
                  This is the plain text information you want to share.
               </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
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