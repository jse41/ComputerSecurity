import React from 'react';
import {Form, Button} from 'react-bootstrap';
import Page from "../components/shared/page";
import Latex from 'react-latex'
//import bitsToStr from "../bit-handling-2";
//import { result } from 'lodash';

// The cycle for actual bit manipulation
function md5cycle(x, k) {
   // The initial variables of the rotates
   var a = x[0], b = x[1], c = x[2], d = x[3];

   // The rotation amounts specialized to md5
   let rotate_amounts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

   // Generate the unique sine based values to be factored in
   let K = getDefaults()

   // The actual looping of md5
   for (let index = 0; index < 64; index++) {
      // F stores the newly computed value
      let F = 0x00000000
      let g = 0
      if (index < 16) {
         g = index
         F = ff(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 16 && index < 32) {
         g = (5 * index + 1) % 16
         F = gg(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 32 && index < 48) {
         g = (3 * index + 5) % 16
         F = hh(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 48) {
         g = (7 * index) % 16
         F = ii(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      // actually rotate them
      a = d
      d = c
      c = b
      b = F
   }

   // Make sure the addition always take place in 32 bit space
   x[0] = add32(a, x[0]);
   x[1] = add32(b, x[1]);
   x[2] = add32(c, x[2]);
   x[3] = add32(d, x[3]);

   // Return happens since the values in x are returned
}

// This does the addditions and rotations of the bits
function collect(q, a, b, x, s, t) {
   a = add32(add32(a, q), add32(x, t));
   /// The right shift is to make it a circular shift
   return add32((a << s) | (a >>> (32 - s)), b);
}

// These are the functions defined by MD5
function ff(a, b, c, d, x, s, t) {
   return collect((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
   return collect((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
   return collect(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
   return collect(c ^ (b | (~d)), a, b, x, s, t);
}

// The quickest way to make sure the result is in 32 bit space
function add32(a, b) {
   return (a + b) & 0xFFFFFFFF
}

// MD5 function to gernerate some seed numbers
function getDefaults() {
   let K = []
   for (let i = 0; i < 64; i++) {
      K.push(Math.floor((2 ** 32) * Math.abs(Math.sin(i + 1))))
   }
   return K
}

function makeMD5(s) {
   var n = s.length
   let i

   // Defined by MD5
   let initials = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
   var hash = initials

   // Loop over the string in 512 bit increments to build the resulting string
   //     64 characters at 8 bits a character is 512
   for (i = 64; i <= n; i += 64) {
      let block = md5block(s.substring(i - 64, i))
      md5cycle(hash, block);
   }

   // isolate the final string
   s = s.substring(i - 64);

   // The last block
   var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

   // Build the block with the characters in the approapriate form
   //     Lower bits come first
   for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);

   // Set the leading 1 bit of the buffer
   tail[i >> 2] |= 0x80 << ((i % 4) << 3);

   // If the string took up too much space, make another block essentially
   if (i > 55) {
      md5cycle(hash, tail);
      for (i = 0; i < 16; i++) {
         tail[i] = 0;
      }
   }

   // describe the size of size of the entire message which goes on the end
   tail[14] = (n * 8) % (2 ** 64);

   // Hash the last block
   md5cycle(hash, tail);

   // hash has always been holding the result, so now return it
   return hash;
}

// Make the md5 blocks
function md5block(s) {
   // store the set of blocks as the result, must be 512 "bits" in response
   let md5blocks = [];
   for (let i = 0; i < 64; i += 4) {
      // Store first charater in the lowest of the bits
      md5blocks[i >> 2] = s.charCodeAt(i)
         + (s.charCodeAt(i + 1) << 8)
         + (s.charCodeAt(i + 2) << 16)
         + (s.charCodeAt(i + 3) << 24);
   }
   return md5blocks;
}

// Actually print it in a readable HEX format
function makeHex(n) {
   let hex_chr = '0123456789ABCDEF'.split('');
   let s = '';
   for (let index = 0; index < 4; index++)
      s += hex_chr[(n >> (index * 8 + 4)) & 0x0F]
         + hex_chr[(n >> (index * 8)) & 0x0F];
   return s;
}

// Loop over to join all the appropriate hex values together
function hex(x) {
   for (var i = 0; i < x.length; i++)
      x[i] = makeHex(x[i]);
   return x.join('');
}

// Calls all that is needed to return the text output of MD5
function md5(message) {
   return hex(makeMD5(message));
}


function makeDisplayBlock(s) {
   let n = s.length
   let result = []
   let i;
   // Loop over the string in 512 bit increments to build the resulting string
   //     64 characters at 8 bits a character is 512
   for (i = 64; i <= n; i += 64) {
      let block = md5block(s.substring(i - 64, i))
      result.push(block)
   }

   // isolate the final string
   s = s.substring(i - 64);

   // The last block
   var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

   // Build the block with the characters in the approapriate form
   //     Lower bits come first
   for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);

   // Set the leading 1 bit of the buffer
   tail[i >> 2] |= 0x80 << ((i % 4) << 3);

   // If the string took up too much space, make another block essentially
   if (i > 55) {
      result.push(tail)
      for (i = 0; i < 16; i++) {
         tail[i] = 0;
      }
   }

   // describe the size of size of the entire message which goes on the end
   tail[14] = (n * 8) % (2 ** 64);

   // Hash the last block
   result.push(tail)
   return(result)
} 

function makePretty(arr) {
   let result = ""; 
   for (let outer = 0; outer < arr.length; outer++) {
      for(let index = 0; index < arr[outer].length; index++) {
         //result += bitsToStr(arr[outer][index])
         result += (arr[outer][index]).toString(2)
         result += ", "
      }
   }
   return result
}

// The cycle for actual bit manipulation
function* md5cycleIterations(x, k) {
   // The initial variables of the rotates
   var a = x[0], b = x[1], c = x[2], d = x[3];

   // The rotation amounts specialized to md5
   let rotate_amounts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

   // Generate the unique sine based values to be factored in
   let K = getDefaults()

   // The actual looping of md5
   for (let index = 0; index < 64; index++) {
      // F stores the newly computed value
      let F = 0x00000000
      let g = 0
      if (index < 16) {
         g = index
         F = ff(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 16 && index < 32) {
         g = (5 * index + 1) % 16
         F = gg(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 32 && index < 48) {
         g = (3 * index + 5) % 16
         F = hh(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      else if (index >= 48) {
         g = (7 * index) % 16
         F = ii(a, b, c, d, k[g], rotate_amounts[index], K[index]);
      }
      // actually rotate them
      a = d
      d = c
      c = b
      b = F
      let iterum = {'a': a, 'b': b, 'c': c, 'd': d}
      console.log(iterum)
      yield(iterum)
   }

   // Make sure the addition always take place in 32 bit space
   x[0] = add32(a, x[0]);
   x[1] = add32(b, x[1]);
   x[2] = add32(c, x[2]);
   x[3] = add32(d, x[3]);

   // Return happens since the values in x are returned
}

function makeASCII(input) {
   var output = ""
   for (var i = 0; i < input.length; i++) {
      output += input[i].charCodeAt(0).toString(2) + " ";
   }
   return output
}

var curHash = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class Md5Page extends React.Component {

   constructor(props) {
      super(props);
      let blocks = makeDisplayBlock("")
      this.state = {
         isToggleOn: true,
         message: "",
         result: md5(""),
         ascii: "",
         cipher: "",
         clear: "",
         aCur: hex([curHash[0]]),
         bCur: hex([curHash[1]]),
         cCur: hex([curHash[2]]),
         dCur: hex([curHash[3]]),
         iterator: md5cycleIterations(curHash, blocks[0]), 
         iteration: 0,
         encodedPretty: makePretty(blocks),
         encoded: blocks,
         warning: "",
         numIteration: 0,
         disableButton: true,
      };

      this.handleFormUpdate = this.handleFormUpdate.bind(this);
      this.handleClick = this.handleClick.bind(this)
   }

   handleFormUpdate(e) {
      if(e.target.id === "EncryptUpdate") {
         let input = e.target.value
         let blocks = makeDisplayBlock(input)
         let initials = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
         this.setState({
            message: input,
            result: md5(input),
            ascii: makeASCII(input),
            encodedPretty: makePretty(blocks),
            encoded: blocks,
            aCur: hex([initials[0]]),
            bCur: hex([initials[1]]),
            cCur: hex([initials[2]]),
            dCur: hex([initials[3]]),
            iterator: md5cycleIterations(curHash, blocks[0]),
            iteration: 0,
            warning: "",
            numIteration: 0,
            disableButton: false,
         })
      }
   }

   handleClick(e) {
      let result = this.state.iterator.next().value
      if (result) {
         if (this.state.numIteration !== 63) {
            this.setState({
               aCur: hex([result['a']]),
               bCur: hex([result['b']]),
               cCur: hex([result['c']]),
               dCur: hex([result['d']]),
               numIteration: this.state.numIteration + 1
            }) 
         }
         else{
            result = this.state.iterator.next().value
            let temp = JSON.parse(JSON.stringify(curHash))
            //for(let index = 0; index < 4; index++) {
            //   temp.push(curHash[index])
            //}
            console.log(temp)
            this.setState({
               aCur: hex([temp[0]]),
               bCur: hex([temp[1]]),
               cCur: hex([temp[2]]),
               dCur: hex([temp[3]]),
               numIteration: this.state.numIteration + 1,
               //disableButton: true
            })
         }
         
      }
      else {
         let nextIter = this.state.iteration + 1
         if (nextIter < this.state.encoded.length) {
            console.log(this.state.encoded)
            //console.log(md5cycle(curHash, this.state.encoded[nextIter]))
            //for(let i = 0; i < 4; i++) {
            //   console.log(hex(curHash[i]))
           // }
           //console.log(hex(curHash))
            this.setState({
               iterator: md5cycleIterations(curHash, this.state.encoded[nextIter]),
               iteration: nextIter,
               numIteration: 0,
            })
         }
         else {
            this.setState({
               warning: 'Done Encrypting! Enter a new message to iterate again.',
               disableButton: true
            })
         }
      }
   }

   render() {
      return (
          <Page title="MD5">
             <p>MD5 (or the Fifth Generation of the Message-Digest Algorithm) is a hashing function that yields a 128-bit hash of any length message.</p>
             <Form>
                <Form.Group controlId="EncryptUpdate">
                   <Form.Label><b>Message</b></Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Message to Encrypt" />
                   <Form.Text className="text-muted">
                      This is the plain text information you want to share.
                   </Form.Text>
                </Form.Group>
                <p><b>ASCII (bit code) Representation of Your Message</b></p>
                <p>{this.state.ascii}</p>
                <hr/>
                <p><b>Resulting MD5 Hash in Hex</b></p>
                <p>{this.state.result}</p>
                <hr/>
                <p><b>How Does it Work?</b></p>
                <p style={{textAlign: 'left'}}>The MD5 algorithm processes the input variable-length message into a resulting fixed-length hash of 128-bits. As shown below, the input message is broken into sixteen 32-bit words
                   based on its ASCII character codes, making chunks of 512-bit blocks.</p>
                <p>{this.state.encodedPretty}</p>
                <p style={{textAlign: 'left'}}>Then, the message is run through a padding technique in which a single one-bit is appended to the end of the message, followed by as many zeros as necessary
                   to bring the length of the message to 64 bits <i>less than</i> a multiple of 512. Then, the remaining bits are filled up with 64 bits representing the length of the
                   original message, modulo <Latex>{'$$2^{64}$$'}</Latex>. This allows the message's length to be fixed to a multiple of 512, conforming to the encryption length necessary.
                </p>
                <p style={{textAlign: 'left'}}>MD5 initially starts with fixed constants for four 32-bit words, shown below as A, B, C, and D. Each 512-bit message block modifies the state through <i>rounds</i>. Each round
                is composed of 16 similar operations reliant on a non-linear function F, modular addition, and left rotation. Each iteration can be stepped through below showing the modification of
                each of the four 32-bit words, represented in hexadecimal below, until the encryption is complete (after 64 iterations, for a total of 65 iterations):</p>
                {this.state.disableButton && <p><i>In order to demonstrate iterations of the MD5 algorithm, you must have a message to encrypt.</i></p>}
                <Button disabled={this.state.disableButton} variant="primary" onClick={this.handleClick}>Iteration</Button>
                <p>A: {this.state.aCur}</p>
                <p>B: {this.state.bCur}</p>
                <p>C: {this.state.cCur}</p>
                <p>D: {this.state.dCur}</p>
                <p>Iteration: {this.state.numIteration}</p>
                <p>Block Number: {this.state.iteration + 1}</p>
                <p>{this.state.warning}</p>
                <br></br>
                <p style={{textAlign: 'left'}}>The result of the function is output into the <b>B</b> variable each iteration. You can see the rest of the variable values are just circularly
                shifted into the following variable (B into C, C into D, and D into A).</p>
                <p style={{textAlign: 'left'}}>Each MD5 operation utilizes one of four possible bitwise functions, and the function shifts after 16 rounds:</p>
                <Latex>{'$$F(B,C,D)=(B \\land C) \\lor (\\lnot B \\land D)$$'}</Latex>
                <br/>
                <Latex>{'$$G(B,C,D)=(B \\land D) \\lor (C \\land \\lnot D)$$'}</Latex>
                <br/>
                <Latex>{'$$H(B,C,D)=B \\oplus C \\oplus D$$'}</Latex>
                <br/>
                <Latex>{'$$I(B,C,D)=C \\oplus (B \\lor \\lnot D)$$'}</Latex>
                <p></p>

             </Form>
          </Page>
      )
   }
}
export default Md5Page;
