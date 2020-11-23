import React from 'react';
import Page from "../components/shared/page";
import {Form} from 'react-bootstrap';

class Encrypt1 extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         isToggleOn: true,
         message: "",
         key: "",
         result: "",
         cipher: "",
         cipherKey: "",
         clear: ""
      };

      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.handleFormUpdate = this.handleFormUpdate.bind(this);
    }

   handleClick(e) {
      e.preventDefault();
      console.log(e.target.id)
      console.log(this.state.message);
   }

   handleFormUpdate(e) {
      if(e.target.id === "EncryptUpdate") {
         this.setState({message: e.target.value});
         this.setState({result: this.encrypt(e.target.value, this.state.key)})
      }
      else if (e.target.id === "keyUpdate") {
         this.setState({key: e.target.value});
         this.setState({result: this.encrypt(this.state.message, e.target.value)})
      }
      else if(e.target.id === "cipherUpdate") {
         this.setState({cipher: e.target.value});
         this.setState({clear: this.decrypt(e.target.value, this.state.cipherKey)})
      }
      else if (e.target.id === "cipheyKeyUpdate") {
         this.setState({cipherKey: e.target.value});
         this.setState({clear: this.decrypt(this.state.cipher, e.target.value)})
      }
   }

   encrypt(message, key) {

      let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
      "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]", ";", "'", "\"", "\\", "|", ":", "_", "+",
      ",", ".", "<", ">", "{", "}", "/", "?", "`", "~", " "]

      let result = ""

      for(let i = 0; i < message.length; i++){
         let index = chars.indexOf(message[i])
         if (index === -1)
            return("Unrecognized Character in Message")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            keyIndex = chars.indexOf(keyChar)
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         let encoded = (keyIndex + index) % chars.length
         result += chars[encoded]
      }
      return result
   }

   decrypt(cipher, key) {
      let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
      "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]", ";", "'", "\"", "\\", "|", ":", "_", "+",
      ",", ".", "<", ">", "{", "}", "/", "?", "`", "~", " "]

      let result = ""

      for(let i = 0; i < cipher.length; i++){
         let index = chars.indexOf(cipher[i])
         if (index === -1)
            return("Unrecognized Character in the Cipher")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            keyIndex = chars.indexOf(keyChar)
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         let encoded = (index - keyIndex + chars.length) % chars.length
         console.log(encoded)
         result += chars[encoded]
      }
      return result
   }

   ord(string) {
      return string.charCodeAt(0);
   }


   render() {
      return (
          <Page title="Vigenere Cipher">
             <Form>
                <Form.Group controlId="EncryptUpdate">
                   <Form.Label>Message</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Message to Encrypy" />
                   <Form.Text className="text-muted">
                      This is the plain text information you want to share.
                   </Form.Text>
                </Form.Group>

                <Form.Group controlId="keyUpdate">
                   <Form.Label>Key</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Any Length Key" />
                   <Form.Text className="text-muted">
                      This is the secret key both you and the recipient know.
                   </Form.Text>
                </Form.Group>
             </Form>
             <p>{this.state.result}</p>
             <br></br>
             <br></br>
             <br></br>
             <Form>
                <Form.Group controlId="cipherUpdate">
                   <Form.Label>Cipher</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="The CIpher Text" />
                   <Form.Text className="text-muted">
                      This is the cipher text you received.
                   </Form.Text>
                </Form.Group>

                <Form.Group controlId="cipheyKeyUpdate">
                   <Form.Label>Key</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Any Length Key" />
                   <Form.Text className="text-muted">
                      This is the secret key that was used to encrypt thie message.
                   </Form.Text>
                </Form.Group>
             </Form>
             <p>{this.state.clear}</p>
             <br></br>
          </Page>
      )
   }
}
export default Encrypt1;
