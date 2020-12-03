/* eslint-disable */
import React, {useEffect, useState} from 'react';
import Page from '../components/shared/page';
import Nav from '../components/Nav';
import '../components/styling/RSA.css';
import {ListGroup, Form} from 'react-bootstrap';
import Latex from 'react-latex';

/**
 * About Page Wrapper, relies on React Router for routing to here
 */

/* global BigInt */
function ascii_encrypt(message) {
    var i;
    var text = "";
    for (i = 0; i < message.length; i++) {
        text += message.charCodeAt(i) + " ";
    }
    text = text.substring(0, text.length - 1);
    return text;
}

function ascii_decrypt(message) {
    message = message.split(' ');
    var i;
    var text = '';
    for (i = 0; i < message.length; i++) {
        text += String.fromCharCode(parseInt(message[i]));
    }
    return text;
}

function calc_n(p, q) {
    return p * q;
}

function calc_phi_n(p, q) {
    return (p - 1) * (q - 1);
}

// Assume input message is ascii encrypted
function rsa_encrypt(message, e, N) {
    if (message === '' || N === 0) {
        return ''
    }
    message = message.split(' ');
    var i;
    var text = "";
    for (i = 0; i < message.length; i++) {
        text += Number((BigInt(parseInt(message[i])) ** BigInt(e)) % BigInt(N)) + ' ';
    }
    text = text.substring(0, text.length - 1);
    return text;
}

// Assume input message is rsa encrypted (message = c)
function rsa_decrypt(message, d, N) {
    if (message === '' || N === 0) {
        return ''
    }
    message = message.split(' ');
    var i;
    var text = "";
    for (i = 0; i < message.length; i++) {
        text += Number((BigInt(parseInt(message[i])) ** BigInt(d)) % BigInt(N)) + ' ';
    }
    text = text.substring(0, text.length - 1);
    return text;
}

// console.log('I aint never seen 2 pretty best friends');
// console.log(ascii_encrypt('I aint never seen 2 pretty best friends'));
// console.log(rsa_encrypt(ascii_encrypt('I aint never seen 2 pretty best friends'), 47, 3127));
// console.log(rsa_decrypt(rsa_encrypt(ascii_encrypt('I aint never seen 2 pretty best friends'), 47, 3127), 2631, 3127));
// console.log(ascii_decrypt(rsa_decrypt(rsa_encrypt(ascii_encrypt('I aint never seen 2 pretty best friends'), 47, 3127), 2631, 3127)));

function gcd(a, b) {
    if ((typeof a !== 'number') || (typeof a !== 'number'))
        return false;
    while (b) {
        var t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function isPrime(val) {
    if (val == 0) {
        return ''
    }

    for (var i = 2; i <= Math.sqrt(val); i++) {
        if (val % i === 0) {
            return 'Invalid value';
        }
    }

    if (val > 1) {
        return 'Valid value';
    } else {
        return 'Invalid value';
    }
}

function isValid_e(e, p, q) {
    if (e == 0 || p == 0 || q == 0) {
        return '';
    }

    var N = calc_n(p, q);
    var phi = calc_phi_n(p, q);
    if (e <= 1 || e >= phi) {
        return 'Invalid value';
    } else if (gcd(e, N) > 1) {
        return 'Invalid value';
    } else if (gcd(e, phi) > 1) {
        return 'Invalid value';
    } else {
        return 'Valid value';
    }
}

function generate_e(p, q) {
    if (p == 0 || q == 0) {
        return '';
    }
    var N = calc_n(p, q);
    var phi = calc_phi_n(p, q);
    var res = "";
    var i;

    let count = phi < 1000 ? phi : 1000

    for (i = 2; i < count; i++) {
        if (gcd(i, N) > 1 || gcd(i, phi) > 1) {
            continue
        } else {
            res += i.toString() + ", ";
        }
    }
    return res
}

function isValid_d(d, e, p, q) {
    if (d == 0 || e == 0 || p == 0 || q == 0) {
        return '';
    }

    var phi = calc_phi_n(p, q);
    var mod = (d * e) % phi;
    if (mod === 1) {
        return 'Valid value';
    } else {
        return 'Invalid value';
    }
}

function generate_d(e, p, q) {
    if (e == 0 || p == 0 || q == 0) {
        return '';
    }

    var phi = calc_phi_n(p, q);
    var res = "";
    var i;

    for (i = 1; i < 5*phi; i++) {
        var mod = (i * e) % phi;

        if (mod === 1) {
            res += i.toString() + ", ";
        } else {
            continue;
        }
    }

    return res;
}

const RsaPage = () => {

    // keeps track of p and q values and uses set function in inputs
    const [p, setP] = useState('');
    const [q, setQ] = useState('');
    const [n, setN] = useState('');
    const [phi, setPhi] = useState('');
    const [e, setE] = useState('');
    const [d, setD] = useState('');
    const [message, setMessage] = useState('');
    const [ascii_encrypted, setASCIIencrypt] = useState('');
    const [rsa_encrypted, setRSAencrypt] = useState('');
    const [rsa_decrypted, setRSAdecrypt] = useState('');
    const [ascii_decrypted, setASCIIdecrypt] = useState('');


    // only called when p or q changes, updates n using the function
    useEffect(() => {
        setN(calc_n(p, q))
    }, [p, q])

    useEffect(() => {
        setPhi(calc_phi_n(p, q))
    }, [p, q])

    useEffect(() => {
        setASCIIencrypt(ascii_encrypt(message))
    }, [message])

    useEffect(() => {
        setRSAencrypt(rsa_encrypt(ascii_encrypted, e, n))
    }, [ascii_encrypted, e, n])

    useEffect(() => {
        setRSAdecrypt(rsa_decrypt(rsa_encrypted, d, n))
    }, [rsa_encrypted, d, n])

    useEffect(() => {
        setASCIIdecrypt(ascii_decrypt(rsa_decrypted))
    }, [rsa_decrypted])

    return (
        <Page title="RSA">
            <ListGroup className='steps'>
                <h2>Key Generation</h2>
                <ListGroup.Item>
                    <p>
                        <Latex>Receiver (decryptor) picks two prime numbers: $(p, q)$</Latex>
                    </p>
                    <div className='user-input'>
                        <Form.Group className='form-inline'>
                            <Form.Label>
                                <Latex>$p:\ $ </Latex>
                            </Form.Label>
                            <Form.Control type='number' placeholder='enter p' value={p}
                                          onChange={event => setP(event.target.value)}/>
                        </Form.Group>
                        <p>{isPrime(p)}</p>

                        <Form.Group className='form-inline'>
                            <Form.Label>
                                <Latex>$q:\ $ </Latex>
                            </Form.Label>
                            <Form.Control type='number' placeholder='enter q' value={q}
                                          onChange={event => setQ(event.target.value)}/>
                        </Form.Group>
                        <p>{isPrime(q)}</p>

                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>The product of p and q will become half of the public key</p>
                    <p>
                        <Latex>We calculate $n = p \times q$:</Latex>
                    </p>
                    <p>
                        <Latex>$n =\ $</Latex>
                        {n}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <p>Using Euler's Totient Function, we calculate <Latex>$\phi(n)$</Latex> which is the number of positive integers less than n that are coprime to n.</p>
                        <strong>
                            <Latex>$\phi$ function: </Latex>
                        </strong>
                        <Latex>Calcute $\phi(n) = (p-1)(q-1)$</Latex>
                    </p>
                    <p>
                        <Latex>$\phi(n) =\ $</Latex>
                        {phi}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        A number <em>e</em> is a relatively prime number to <Latex>$\phi$(n)</Latex> that will be the other half of the public key
                    </p>
                    <p>
                        <Latex>Receiver (decryptor) picks encryption number e: </Latex>
                    </p>
                    {/* Use isValid_e here */}
                    <div className='user-input'>
                        <Form.Group className='form-inline'>
                            <Form.Label>
                                <Latex>$e:\ $ </Latex>
                            </Form.Label>
                            <Form.Control type='number' placeholder='enter e' value={e}
                                          onChange={event => setE(event.target.value)}/>
                        </Form.Group>
                        <p>{isValid_e(e, p, q)}</p>
                        <p>Suggestions: {generate_e(p, q)}</p>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <Latex>Public Key Becomes: </Latex>
                    </p>

                    <p>
                        <Latex>$(e, N) = ($</Latex>
                        {e}
                        <Latex>$, $</Latex>
                        {n}
                        <Latex>$ )$</Latex>
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        The private key, <em>d</em> a modular inverse of <Latex>$e \ modulo \ \phi (n)$</Latex>
                    </p>
                    <p>
                        <Latex>Receiver (decryptor) picks number d:</Latex>
                    </p>
                    {/* Use isValid_d here */}
                    <div className='user-input'>
                        <Form.Group className='form-inline'>
                            <Form.Label>
                                <Latex>$d:\ $</Latex>
                            </Form.Label>
                            <Form.Control type='number' placeholder='enter d' value={d}
                                          onChange={event => setD(event.target.value)}/>
                        </Form.Group>
                        <p>{isValid_d(d, e, p, q)}</p>
                        <p>Suggestions: {generate_d(e, p, q)}</p>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <Latex>The Sender picks a message to encrypt</Latex>
                    </p>
                    <div className='user-input'>
                        <Form.Group className='form-inline'>
                            <Form.Label>
                                <Latex>Message $:\  $</Latex>
                            </Form.Label>
                            <Form.Control type='text' placeholder='enter message' value={message}
                                          onChange={event => setMessage(event.target.value)}/>
                        </Form.Group>
                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>This message is then converted to a number <em>m</em> which is commonly the ASCII encryption (translation) of the message</p>
                    <p>
                        <Latex>$m:\ $ </Latex>
                    </p>
                    <p>
                        {/* Use ascii_encrypt() here, since we're not rendering anything on screen, we call it as a function */}
                        {ascii_encrypted}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <Latex>The Sender sends RSA Encrypted sequence (ciphertext) which is calculated by the following formula </Latex>
                    </p>
                    <p>
                        <Latex>$m^e\:mod\:(n)\:=\:c$</Latex>
                        {/* Use rsa_encrypt() here, with message = ascii_encrypt() */}
                        <br/>
                        {rsa_encrypted}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <Latex>Receiver (decryptor) decrypts ciphertext $c$ and recieves the ASCII ciphered message m, which is calculated by the following formula</Latex>
                    </p>
                    <p>
                        <Latex>$c^d\:mod\:(n)\:=m$</Latex>
                        {/* Use rsa_encrypt() here, with message = ascii_encrypt() */}
                        <br/>
                        {rsa_decrypted}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <p>
                        <Latex>Finally, the receiver calculates the ASCII Decryption and recieves the plaintext original message: </Latex>
                    </p>
                    <p>
                        {/* Use ascii_decrypt() here, with message = m from c^d mod N */}
                        {ascii_decrypted}
                    </p>
                </ListGroup.Item>
            </ListGroup>
        </Page>
    );
};
export default RsaPage;
