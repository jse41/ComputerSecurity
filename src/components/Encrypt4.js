import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';

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

// This does the addditions and rotations of the bots 
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

// The quickes way to make sure the result is in 32 bit space 
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
   for (i = 64; i <= s.length; i += 64) {
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
      for (i = 0; i < 16; i++) tail[i] = 0;
   }

   // describe the size of size of the entire messag which goes on the end 
   tail[14] = (n * 8) % 512;

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