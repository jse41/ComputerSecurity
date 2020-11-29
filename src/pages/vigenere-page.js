import React from 'react';
import Page from "../components/shared/page";
import {Form, Row, Col, Container} from 'react-bootstrap';

class VigenerePage extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         isToggleOn: true,
         message: "",
         key: "",
         result: "",
         cipher: "",
         cipherKey: "",
         clear: "",
         useAscii: false,
      };

      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
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

   handleChange(e) {
      let currentToggle = this.state.useAscii
      this.setState({useAscii: !currentToggle}, this.runUpdates)
   }

   runUpdates() {
      this.setState({result: this.encrypt(this.state.message, this.state.key)})
      this.setState({clear: this.decrypt(this.state.cipher, this.state.cipherKey)})
   }

   encrypt(message, key) {

      let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
      "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]", ";", "'", "\"", "\\", "|", ":", "_", "+",
      ",", ".", "<", ">", "{", "}", "/", "?", "`", "~", " "]

      let result = ""

      for(let i = 0; i < message.length; i++){
         let index
         if(this.state.useAscii) {
            index = message[i].charCodeAt(0);
         }
         else {
            index = chars.indexOf(message[i])
         }
         
         if (index === -1)
            return("Unrecognized Character in Message")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            if(this.state.useAscii) {
               keyIndex = keyChar.charCodeAt(0);
            }
            else {
               keyIndex = chars.indexOf(keyChar)
            }
            
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         if (this.state.useAscii) {
            let encoded = (keyIndex + index) % 127
            result += String.fromCharCode(encoded)
         }
         else {
            let encoded = (keyIndex + index) % chars.length
            result += chars[encoded]
         }
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
         let index
         if(this.state.useAscii) {
            index = cipher[i].charCodeAt(0);
         }
         else {
            index = chars.indexOf(cipher[i])
         }
         if (index === -1)
            return("Unrecognized Character in the Cipher")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            if(this.state.useAscii) {
               keyIndex = keyChar.charCodeAt(0);
            }
            else {
               keyIndex = chars.indexOf(keyChar)
            }
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         if(this.state.useAscii){
            let encoded = (index - keyIndex + 127) % 127
            result += String.fromCharCode(encoded)
         }
         else {
            let encoded = (index - keyIndex + chars.length) % chars.length
            //console.log(encoded)
            result += chars[encoded]
         }
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
             <br></br>
            <Container>
               <Row>
                  <Col>Encoded Message:</Col>
                  <Col>
                     <p>{this.state.result}</p>
                  </Col>
               </Row>
            </Container>
             
             <br></br>
             <fieldset>
               <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={2}>
                  Encoding Options
                  </Form.Label>
                  <Col sm={10}>
                  <Form.Check
                     type="radio"
                     label="Visual Character Set"
                     name="formHorizontalRadios"
                     id="formHorizontalRadios1"
                     checked={!this.state.useAscii}
                     onChange={this.handleChange}
                  />
                  <Form.Check
                     type="radio"
                     label="ASCII"
                     name="formHorizontalRadios"
                     id="formHorizontalRadios2"
                     checked={this.state.useAscii}
                     onChange={this.handleChange}
                  />
                  </Col>
               </Form.Group>
            </fieldset>
             <br></br>
             <br></br>
             <Form>
                <Form.Group controlId="cipherUpdate">
                   <Form.Label>Cipher</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="The Cipher Text" />
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
             <Container>
               <Row>
                  <Col>Decrypted Message:</Col>
                  <Col>
                     <p>{this.state.clear}</p>
                  </Col>
               </Row>
            </Container>
             <br></br>
          </Page>
      )
   }
}
export default VigenerePage;
