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

function Data(props) {

  const wallet = new Wallet();

  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState('');

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  const startUp = async () => {
    setData([1,2,3])
    //this.key = wallet.getPrivateKey();
  }

  useEffect(() => {
    startUp()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (document.getElementById("submitButtonView").disabled || 
      document.getElementById("submitButtonView").disabled) {
      alert("disabled");
      return;
    }

    document.getElementById("submitButtonSave").disabled = true;
    document.getElementById("submitButtonView").disabled = true;

    const itemName = document.getElementById("formItemName").value;
    const localStorageObject = document.getElementById("formJSONObject").value;

//alert('clcicked:' + clicked);

    if (clicked === 'view') {
      console.log('xxxxxxxxxxxxxxxxx', localStorage.getItem(itemName));
      console.log(localStorage.getItem(itemName) === '');
      console.log(localStorage.getItem(itemName));
//      const prettyData = (localStorage.getItem(itemName) === '') ? 
//        JSON.stringify({}) :
//        JSON.stringify(
//          JSON.parse(localStorage.getItem(itemName)),
//          undefined,
//          2
//        );

      const prettyData = JSON.stringify(
        JSON.parse(localStorage.getItem(itemName)),
        //{},
        undefined,
        2
      );
      const data = JSON.parse(localStorage.getItem(itemName));
      console.log('localStorage', data);
      document.getElementById("formJSONObject").value = prettyData;
    } else if (clicked === 'save') {
      if (itemName !== '' && localStorageObject !== '') {
        localStorage.setItem(
          itemName,
          localStorageObject,
        );
      }
    } else if (clicked === 'create') {
      if (itemName !== '' && localStorageObject !== '') {
        localStorage.setItem(
          itemName,
          localStorageObject,
        );
      }
    }

    document.getElementById("submitButtonSave").disabled = false;
    document.getElementById("submitButtonView").disabled = false;
    document.getElementById("submitButtonCreate").disabled = false;
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Data Home</Card.Title>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Data Home</Card.Title>
          data.length: { data.length }<br/>
          data: { JSON.stringify(data, null, 4) }<br/>
          key: { JSON.stringify(wallet.getPrivateKey(), null, 4) }
        </Card.Body>
      </Card>
    </>
  );

/*
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Local Storage</Card.Title>
          { (validationErrors.length > 0) &&
            <Card.Title className="mb-2 p-3 text-warning"> 
              Validation Error:
              <Alert key="warning" variant="warning">
                {validationErrors.map((error) => <div>{error}</div>)}
              </Alert>
            </Card.Title>
          }
          <Card.Text>
            <div>
            <Form onSubmit={handleSubmit}>

              <Container ref={el=>this.componentRef=el}>

                <div className="pt-3 text-primary h3">
                  JSON Object                     
                </div>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Item Name 
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-3">
                  <Form.Group className="mb-3 pr-3" controlId="formItemName">
                    <Form.Control
                      required
                      type="text"
                      placeholder="item name"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    id="submitButtonView"
                    onClick={() => setClicked('view')}
                  >
                    view
                  </Button>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <textarea class="form-control" id="formJSONObject" rows="9"></textarea>
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

                <Row className="mb-0 pl-3 pt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    id="submitButtonCreate"
                    onClick={() => setClicked('create')}
                  >
                    create
                  </Button>
                </Row>

              </Container>
            </Form>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
*/
}

export default Data;
