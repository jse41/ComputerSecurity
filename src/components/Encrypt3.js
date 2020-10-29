import React from 'react';
import Alert from './Alert';
import Nav from './Nav';
import './styling/RSA.css';
import { ListGroup, Form } from 'react-bootstrap';
import Latex from 'react-latex';

/**
 * About Page Wrapper, relies on React Router for routing to here
 */
const Encrypt3 = () => {
  return (
    <div>
      <Alert />
      <Nav />
      <div className='container'>
        <h1>RSA</h1>

        <ListGroup className='steps'>
          <h2>Key Generation</h2>
          <ListGroup.Item>
            <p>
              <Latex>Reciever picks two prime numbers: $(p, q)$</Latex>
            </p>
            <div className='user-input'>
              <Form.Group className='form-inline'>
                <Form.Label>
                  <Latex>$p$: </Latex>
                </Form.Label>
                <Form.Control type='number' placeholder='enter p' />
              </Form.Group>
              <Form.Group className='form-inline'>
                <Form.Label>
                  <Latex>$q$: </Latex>
                </Form.Label>
                <Form.Control type='number' placeholder='enter q' />
              </Form.Group>
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <p>
              <Latex>Calculate $n = p \times q$</Latex>
            </p>
          </ListGroup.Item>

          <ListGroup.Item>
            <p>
              <strong>
                <Latex>$\phi$ function: </Latex>
              </strong>
              <Latex>Calcute $\phi(n) = (p-1)(q-1)$</Latex>
            </p>
          </ListGroup.Item>

          <ListGroup.Item>
            <p>
              <Latex>Calc modular inverse...</Latex>
            </p>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
};
export default Encrypt3;
