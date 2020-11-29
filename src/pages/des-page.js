import _ from 'lodash';
import React from 'react';
import {Card, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Collapsible from 'react-collapsible';
import bitHandling from '../bit-handling-2';
import {DESRounds} from '../components/DES';
import BinaryDisplay from "../components/shared/binary-display";
import PermutationTable from "../components/shared/permutation-table";
import Page from "../components/shared/page";
import UTFDisplay from "../components/shared/utf-display";
import Latex from 'react-latex';

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
class DesPage extends React.Component {

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

    async setStateSync(state) {
        return new Promise(resolve => this.setState(state, resolve));
    }

    componentDidMount() {
        this.doEncryption();
    }

    handleUpdate(prop, e) {
        this.setState({[prop]: e.target.value});
    }

    generateKeys({originalKey, PC1, PC2}) {
        const N_ROUNDS = 16;
        const NUM_LHS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

        const keys = [];
        const initialPermutation = bitHandling.permutate(originalKey, PC1);
        let [left, right] = bitHandling.makeHalves(initialPermutation);

        for (let round = 0; round < N_ROUNDS; round++) {
            const shifts = NUM_LHS[round];
            left = bitHandling.circularLeftShift(left, shifts);
            right = bitHandling.circularLeftShift(right, shifts);

            const newKey = bitHandling.permutate(bitHandling.fromHalves(left, right), PC2);
            keys.push(newKey);
        }

        return keys;
    }

    addPadding(message) {
        let paddedMessage = message;
        while (paddedMessage.length % 4 !== 0) {
            paddedMessage += " ";
        }
        return paddedMessage;
    }

    encryptBlock({originalBinary, keys, IP, P, FP}) {
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
                initialHalvesCallback: (L, R) => this.setState({L0: L, R0: R}),
            });

            const finalPermutation = bitHandling.permutate(afterDESRounds, FP);
            output += finalPermutation;

            if (this.state.setValues && firstRound) {
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

        //const IP =  bitHandling.makePermutationTable(64, 64);
        const IP = [57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7, 56, 48, 40, 32, 24, 16, 8, 0, 58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6];
        const P = bitHandling.makePermutationTable(32, 32);
        //const FP = bitHandling.invertPermutationTable(IP);
        const FP = [39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25, 32, 0, 40, 8, 48, 16, 56, 24];

        // Generate encrypted message
        const encryptedBinary = this.encryptBlock({
            originalBinary: binaryMessage,
            keys,
            IP,
            P,
            FP,
        });

        // Convert encrypted number to characters for the encrypted message
        let encryptedMessage = this.bitsToHex(encryptedBinary)
        console.log(`Encrypted Message: ${encryptedMessage}`);

        this.setState({
            encryptedPlaintext: encryptedMessage,
            setValues: false,
            keys: keys,
            first64BitBlock: paddedMessage.substring(0, 4),
            IP: IP,
            P: P
        })

        this.doDecryption({
            cipherbits: encryptedBinary,
            keys,
            IP,
            P,
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

    doDecryption({cipherbits, keys, IP, FP, P}) {
        const decryptedBinary = this.encryptBlock({
            originalBinary: cipherbits,
            keys: keys.reverse(),
            IP,
            P,
            FP,
        });

        const decryptedMessage = this.bitsToHex(decryptedBinary);
        console.log(`Decrypted Message: ${decryptedMessage}`);
        console.log(`Decrypted Message: ${bitHandling.bitsToStr(decryptedBinary)}`);
        this.setState({
            decryptedCiphertext: bitHandling.bitsToStr(decryptedBinary),
        })
    }

    hexToBits(hex) {
        let bits = "";
        for (let i = 0; i < hex.length; i = i + 4) {
            bits += parseInt(hex.substring(i, i + 4), 16).toString(2).padStart(16, "0");
        }
        return bits;
    }

    bitsToHex(bits) {
        let hex = "";
        for (let i = 0; i < bits.length; i = i + 16) {
            hex += parseInt(bits.substring(i, i + 16), 2).toString(16).padStart(4, "0");
        }
        return hex;
    }


    render() {
        return (
            <Page title="DES">
                <div style={{textAlign: 'left'}}>
                    <Form>
                        <Form.Group controlId="EncryptUpdate">
                            <Form.Label>Message</Form.Label>
                            <Form.Control type="text" value={this.state.plaintext}
                                          onChange={this.handleUpdate.bind(this, 'plaintext')}
                                          placeholder="Message to Encrypt"/>
                            <Form.Text className="text-muted">
                                This is the plain text information you want to share.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="KeyControl">
                            <Form.Label>Key</Form.Label>
                            <Form.Control type="text" value={this.state.key}
                                          onChange={this.handleUpdate.bind(this, 'key')}
                                          placeholder="Key to Use"/>
                            <Form.Text className="text-muted">
                                The key to use (any string of 4 characters)
                            </Form.Text>
                        </Form.Group>
                        <div style={{textAlign: 'center'}}>
                            <Button variant="primary" onClick={this.doEncryption}>
                                Encrypt
                            </Button>
                        </div>
                    </Form>
                    <br/>
                    <div className="section">
                        <h1>Key Generation</h1>
                        <p>DES uses a 64-bit key to encrypt the plaintext message. This 64-bit key is used to generate
                            16
                            distinct 48-bit keys, which are used in series to encrypt the message.</p>
                    </div>
                    <div className="section">
                        <h3>Key Input</h3>
                        <p>A 4-character string can be used as the 64-bit key because each character can be converted to
                            a 16-bit UTF-16 character code. The key you provided is converted to a 64-bit binary value
                            as shown below</p>
                        <br/>
                        <div style={{textAlign: 'center'}}>
                            <UTFDisplay ascii={this.state.key.substring(0, 4)}/>
                            <br/>
                            <br/>
                            <BinaryDisplay label="Your key"
                                           bits={bitHandling.strToBits(this.state.key.substring(0, 4))}/>
                        </div>
                    </div>
                    <div className="section">
                        <h3>Generated Keys</h3>
                        {this.state.keys.map((key, n) => (
                            <BinaryDisplay
                                label={`$K_{${n + 1}}$`}
                                bits={key}
                            />
                        ))}
                    </div>
                    <div className="section">
                        <h1>Encryption</h1>
                        <p>DES encrypts a message by separating it into 64-bit pieces, and encrypting them one-by-one.
                            For a simple string, this means the message will be encrypted in blocks of four
                            characters.</p>
                        <p>The first block of your message is converted to bits as follows</p>
                        <br/>
                        <div style={{textAlign: 'center'}}>
                            <UTFDisplay ascii={this.state.first64BitBlock}/>
                            <br/>
                            <br/>
                            <BinaryDisplay label="Binary" bits={this.state.first64Bits}/>
                        </div>
                    </div>
                    <div className="section">
                        <h4>Algorithm Overview</h4>
                        <p>
                            <b>Initial Permutation</b>
                            <br/>
                            The first step in DES is to rearrange the bits in the first block using a permutation
                            table, <Latex>$IP$</Latex>.
                        </p>
                        <p>
                            <b>DES Rounds</b>
                            <br/>
                            The encryption process consists of 16 rounds, which correspond to the 16 generated keys.
                            Before the first round, the message is split into left and right
                            halves: <Latex>$L_0$</Latex> and <Latex>$R_0$</Latex>. Each round, the left and right hand
                            sides are modified, so in
                            the <Latex>$n$</Latex><sup>th</sup> round <Latex>$L_n$</Latex> and <Latex>$R_n$</Latex> are
                            defined as…
                        </p>
                        <p style={{textAlign: 'center'}}>
                            <div style={{display: 'inline-block', textAlign: 'left'}}>
                                <Latex>{'$$L_n=R_{n-1}$$'}</Latex>
                                <br/>
                                <Latex>{'$$R_n=L_{n-1} \\oplus f(R_{n-1},K_n)$$'}</Latex>
                            </div>
                        </p>
                        <p>where <Latex>$\oplus$</Latex> is a bitwise XOR, and <Latex>$f$</Latex> is a function that
                            scrambles <Latex>{`$R_{n-1}$`}</Latex> using <Latex>$K_n$</Latex>.</p>
                        <p>
                            <b>Final Permutation</b>
                            <br/>
                            <p>After the 16th round, the final 32-bit <Latex>{`$L_{16}$ and $R_{16}$`}</Latex> are
                                joined back together into a 64-bit message. The bits of this message are rearranged
                                again using another permutation table, <Latex>{`$IP^{-1}$`}</Latex>, which yields the
                                final encrypted message!</p>
                        </p>
                        <p>
                            <b>And… Repeat!</b>
                            <br/>
                            <p>This process is repeated for each 64-bit block of the message to encrypt the whole
                                thing</p>
                        </p>
                    </div>
                    <div className="section">
                        <h4>Initial Permutation <Latex>$(IP)$</Latex></h4>
                        <p>Permutation is the act of mapping with input bit to a new output position. In this
                            permutation, the input is 64 bits and the output is 64 bits, no bits are lost or created,
                            instead each and every bit is mapped to a single new location. For example, since the first
                            entry in the permutation table is {this.state.IP[0]}, the bit at that index in the input
                            becomes the first bit of the output.</p>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Latex>$IP=$</Latex>&nbsp;
                            <PermutationTable table={this.state.IP} columns={8}/>
                        </div>
                        <br/>
                        <BinaryDisplay label="Before Permuting" bits={this.state.first64Bits}/>
                        <BinaryDisplay label="After Permuting" bits={this.state.afterInitialPermutation}/>
                    </div>
                    <div className="section">
                        <h4>DES Rounds</h4>
                        <p>This permuted message is then split into <Latex>$L_0$ and $R_0$</Latex>, as follows…</p>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-md-6 text-center">
                                    <BinaryDisplay label="$L_0$" bits={this.state.L0}/>
                                </div>
                                <div className="col-12 col-md-6 text-center">
                                    <BinaryDisplay label="$R_0$" bits={this.state.R0}/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <p>After this, each <Latex>$L_n$</Latex> and <Latex>$R_n$</Latex> are computed as &nbsp;
                            <Latex>{'$L_n=R_{n-1}$ and $R_n=L_{n-1} \\oplus f(R_{n-1},K_n)$.'}</Latex>
                        </p>
                        <Card style={{padding: '0.5em 1em'}}>
                            <Collapsible trigger={<Latex>$f$ function (show more)</Latex>}
                                         triggerWhenOpen={<Latex>$f$ function (hide)</Latex>}>
                                <p>Overview of f function</p>
                                <p>Expansion Box: {this.state.expansionBox}</p>
                                <p>After Expansion: {this.state.afterExpansionBox}</p>
                                <p>XOR with the key:</p>
                                <p>Key: {this.state.keys[0]}</p>
                                <p>After XOR: {this.state.afterXorWithKey}</p>
                                <Card style={{padding: '0.5em 1em'}}>
                                    <Collapsible trigger="S Boxes">
                                        <p>First 6 bits of input: {this.state.afterXorWithKey.substring(0, 6)}</p>
                                        <p>Row (formed with the first and last bit of the
                                            input): {this.state.afterXorWithKey.charAt(0) + this.state.afterXorWithKey.charAt(5)}</p>
                                        <p>Column (formed with the middle 4 bits of the
                                            input): {this.state.afterXorWithKey.substring(1, 5)}</p>
                                        <p>Using the row and column calculated above, the corresponding table entry at that
                                            location is
                                            the new output.</p>
                                    </Collapsible>
                                </Card>
                                <p>After Permutation: {this.state.afterPermutation}</p>
                            </Collapsible>
                        </Card>
                    </div>
                    <div className="section">
                        <h1>Results</h1>
                        <p>Your encrypted message:</p>
                        <p>{this.state.encryptedPlaintext}</p>
                        <br/>
                        <p>The decrypted message:</p>
                        <p>{this.state.decryptedCiphertext}</p>
                    </div>
                </div>
            </Page>
        )
    }
}

export default DesPage;
