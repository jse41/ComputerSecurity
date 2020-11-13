import React from 'react';
import Alert from './Alert'
import Nav from './Nav'
import {Form} from 'react-bootstrap';

function md5cycle(x, k) {
   var a = x[0], b = x[1], c = x[2], d = x[3];

   let rotate_amounts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
   
   let K = getDefaults()

   for (let index = 0; index < 64; index++) {
      let F = 0x00000000
      let g = 0x00000000
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
      a = d
      d = c
      c = b
      b = F 
   }

   x[0] = add32(a, x[0]);
   x[1] = add32(b, x[1]);
   x[2] = add32(c, x[2]);
   x[3] = add32(d, x[3]);

}

function collect(q, a, b, x, s, t) {
   a = add32(add32(a, q), add32(x, t));
   return add32((a << s) | (a >>> (32 - s)), b);
}

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

function add32(a, b) {
   return (a + b) & 0xFFFFFFFF;
}

function getDefaults() {
   let K = []
   for (let i = 0; i < 64; i++) {
      K.push(Math.floor((2 ** 32) * Math.abs(Math.sin(i + 1))))
   }
   return K
}

function makeMD5(s) {
   var n = s.length, i;
   var initials = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
   for (i = 64; i <= s.length; i += 64) {
      md5cycle(initials, md5blk(s.substring(i - 64, i)));
   }
   s = s.substring(i - 64);
   var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
   for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
   tail[i >> 2] |= 0x80 << ((i % 4) << 3);
   if (i > 55) {
      md5cycle(initials, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
   }
   tail[14] = n * 8;
   md5cycle(initials, tail);
   return initials;
}

function md5blk(s) {
   let md5blks = [], i;
   for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i)
         + (s.charCodeAt(i + 1) << 8)
         + (s.charCodeAt(i + 2) << 16)
         + (s.charCodeAt(i + 3) << 24);
   }
   return md5blks;
}

function makeHex(n) {
   let hex_chr = '0123456789abcdef'.split('');
   let s = '';
   for (let index = 0; index < 4; index++)
      s += hex_chr[(n >> (index * 8 + 4)) & 0x0F]
         + hex_chr[(n >> (index * 8)) & 0x0F];
   return s;
}

function hex(x) {
   for (var i = 0; i < x.length; i++)
      x[i] = makeHex(x[i]);
   return x.join('');
}

function md5(message) {
   return hex(makeMD5(message));
}

/** 
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
}*/

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