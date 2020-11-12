import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';
import {circularLeftShift, getBit, setBit} from './../bit-handling';

function md5(message) {
   let binaryVis = getBinary(message)
   let binary = getBinary(message)
   let result = makeMD5(binary)
   console.log("result")
   console.log(getBinary(""))
   console.log(makeMD5(getBinary("")))
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
   let output = [] 
   if (input.length === 0) {
      output.push(0b10000000000000000000000000000000)
      for (let i = 0; i < 15; i++) {
         output.push(0x00000000)
      }
      return output
   }
   let totalLength = input.length * 8
   let numBlocks = 1 
   let tempLength = totalLength - 448
   if (Math.ceil(tempLength / 512) > 0)
      numBlocks += Math.ceil(tempLength / 512)
   for (let i = 0; i < numBlocks * 16; i++) {
      output.push(0x00000000)
   }
   let index
   for (index = 0; index < input.length; index++) {
      let value = input[index].charCodeAt(0)
      output[Math.floor(index / 4)] = output[Math.floor(index / 4)] << 8
      output[Math.floor(index / 4)] = output[Math.floor(index / 4)] | value
   }
   if (index < numBlocks * 16 * 4 - 8) {
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
   }
   let appendedLen = totalLength % (2 ** 64)
   let appendStr = appendedLen.toString(2)
   for(let i = 0; i < appendStr.length; i++){
      if (i < 32){
         console.log(output[output.length - 1])
         output[output.length - 1] = output[output.length - 1] << 1
         if (appendStr[i] === '1') {
            output[output.length - 1] = output[output.length - 1] | 0x00000001
         }
      }
      else {
         output[output.length - 2] = output[output.length - 2] << 1
         if (appendStr[i] === '1') {
            output[output.length - 2] = output[output.length - 2] | 0x00000001
         }
      }
   }
   return output
}

function getDefaults() {
   let K = []
   for (let i = 0; i < 64; i++) {
      K.push(Math.floor((2 ** 32) * Math.abs(Math.sin(i + 1))))
   }
   return K
}

function makeMD5(messageBlocks) {
   let rotate_amounts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

   let K = getDefaults()
   let a0 = 0x67452301   // A
   let b0 = 0xefcdab89   // B
   let c0 = 0x98badcfe   // C
   let d0 = 0x10325476   // D

   for (let block = 0; block < Math.floor(messageBlocks.length / 16); block++) {
      let A = a0
      let B = b0
      let C = c0
      let D = d0 
      for (let i = 0; i < 64; i++) {
         let F = 0x00000000
         let g = 0x00000000
         if (i < 16) {
            F = (B & C) | ((~B) & D)
            g = i
         }
         else if (i >= 16 && i < 32) {
            F = (D & B) | ((~D) & C)
            g = (5 * i + 1) % 16
         }
         else if (i >= 32 && i < 48) {
            F = B ^ C ^ D
            g = (3 * i + 5) % 16
         }
         else if (i >= 48) {
            F = C ^ (B | (~D))
            g = (7 * i) % 16
         }
         F = limitedAdd(limitedAdd(F, A), limitedAdd(K[i], messageBlocks[16 * block + g]))
         A = D
         D = C
         C = B
         B = limitedAdd(B, leftrotate(F, rotate_amounts[i]))
      }
      a0 = limitedAdd(a0, A)
      b0 = limitedAdd(b0, B)
      c0 = limitedAdd(c0, C)
      d0 = limitedAdd(d0, D)
   }
   return [a0.toString(2), b0.toString(2), c0.toString(2), d0.toString(2)]
}

function leftrotate(x, c) {
   return (x << c) | x >> (32 - c)
}


//!!! THE ERROR IS IN HERE, HANDLES "Negative" NUMBERS INCORRECTLY !!!
// THE NUMBERS ARE NOT REALLY NEGATIVE, THEY JUST HAVE A 1 in POSITION 31 
function limitedAdd(a, b) {
   if(a < 0) {
      console.log("ERRORSSSA")
      console.log(a)
      console.log(setBit(a, 31, 0))
      //a *= -1
   }
   if(b < 0) {
      console.log("ERRORSSSB")
      console.log(b.toString(2))
      console.log((b * -1).toString(2))
      //b *= -1
   }
   return ((a + b) & 0xFFFFFFFF)
}

function limitedAdd___(a, b) {
   let result = 0
   let carry = 0
   for(let i = 0; i < 32; i++) {
      let bita = getBit(a, i)
      let bitb = getBit(b, i)
      let temp = carry + bita + bitb
      if(temp === 1 || temp === 3){
         result += 2**i
      }
      if(temp > 1) {
         carry = 1
      }
      if(temp < 2) {
         carry = 0 
      }
   }
   return result 
}

function limitedAdd__(a, b) {
   let result = a + b
   let resultString = result.toString(2)
   let len = resultString.length
   if (len > 32) {
      let newResult = 0
      for(let i = 0; i < 32; i++) {
         newResult = newResult << 1
         if(resultString[len -32 + i] === "1"){
            newResult += 1
         }
      }
      return newResult
   }
   else {
      return result
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