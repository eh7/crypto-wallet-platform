import { useState, useEffect } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
 
import Wallet from '../../services/wallet';

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption

import 'dotenv/config';

function SeedHex(props) {

  const wallet = new Wallet();

  const [clicked, setClicked] = useState('');

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  useEffect(() => {
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (document.getElementById("submitButtonSave").disabled) {
      return;
    }

    document.getElementById("submitButtonSave").disabled = true;

    const seedHex = document.getElementById("formSeedHex").value;

    if (seedHex !== '') {
      localStorage.setItem(
        'seedHex',
        seedHex,
      );
      localStorage.setItem(
        'keyset',
        true,
      );

      if (type === 'init') {
        window.location.href='/';
      }
    }

    document.getElementById("submitButtonSave").disabled = false;
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Eneter Seed Hex</Card.Title>
          { (validationErrors.length > 0) &&
            <Card.Title className="mb-2 p-3 text-warning"> 
              Validation Error:
              <Alert key="warning" variant="warning">
                {validationErrors.map((error) => <div>{error}</div>)}
              </Alert>
            </Card.Title>
          }
          <div>
            <Form onSubmit={handleSubmit}>

	      {/*<Container ref={el=>this.componentRef=el}>*/}
              <Container>

                <Row className="mb-0 pl-3 pt-3">
                  <textarea class="form-control" id="formSeedHex" rows="9"></textarea>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    id="submitButtonSave"
                    onClick={() => setClicked('save')}
                  >
                    save
                  </Button>
                </Row>

              </Container>
            </Form>
          </div>
          <Card.Text>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default SeedHex;
