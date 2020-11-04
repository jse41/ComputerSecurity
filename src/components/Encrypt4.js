import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import {bitString} from './../bit-handling';

function md5(message) {
   let binaryVis = getBinaryVisual(message)
   let binary = getBinary(message)
   return binaryVis
}

function getBinaryVisual(input) {
   let output = ""
   for (var i = 0; i < input.length; i++) {
      let value = input[i].charCodeAt(0).toString(2)
      if(value.length < 8)
         output += "0"
      output += value + " ";
   }
   return output
}

function getBinary(input) {
   let totalLength = input.length * 8
   let numBlocks = Math.ceil(totalLength / 512)
   let output = [] 
   for (let i = 0; i < numBlocks * 16; i++) {
      output.push(0b00000000)
   }
   let index
   for (index = 0; index < input.length; index++) {
      let value = input[index].charCodeAt(0)
      output[Math.floor(index / 4)] = output[Math.floor(index / 4)] << 8
      output[Math.floor(index / 4)] = output[Math.floor(index / 4)] | value
   }
   if (index >= numBlocks * 16 * 4) {
      return output
   }
   else { 
      if (index % 4 === 0) {
         let value = 0b00000001
         output[(index / 4)] = value
         output[(index / 4)] = output[Math.floor(index / 4)] << 31
      }
      else{
         output[Math.floor(index / 4)] = output[Math.floor(index / 4)] << 1
         let value = 0b00000001
         output[Math.floor(index / 4)] = output[Math.floor(index / 4)] | value
         output[Math.floor(index / 4)] = output[Math.floor(index / 4)] << 7
         output[Math.floor(index / 4)] = output[Math.floor(index / 4)] << ((3 - (index % 4)) * 8)
      }
      return output
   }
}

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Encrypt4 extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isToggleOn: true,
         message: "",
         result: "",
         cipher: "",
         clear: ""
      };
      this.handleFormUpdate = this.handleFormUpdate.bind(this);
   }

   handleFormUpdate(e) {
      if(e.target.id === "EncryptUpdate") {
         this.setState({message: e.target.value});
         this.setState({result: md5(e.target.value, this.state.key)})
      }
   }
   
   render() {         
      return (
         <div>
            <Alert />
            <Nav />
            <h1>This is MD5</h1>
            <p>MD5 (or the Fifth Generation of the Message-Digest Algorithm) is a hashing function that yields a 128-bit hash of any length message </p>
            <Form>
            <Form.Group controlId="EncryptUpdate">
               <Form.Label>Message</Form.Label>
               <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Message to Encrypy" />
               <Form.Text className="text-muted">
                  This is the plain text information you want to share.
               </Form.Text>
            </Form.Group>
            <p>{this.state.result}</p>

            </Form>
         </div>
      )
   }
}
export default Encrypt4;