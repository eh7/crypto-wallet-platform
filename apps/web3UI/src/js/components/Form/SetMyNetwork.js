import { useState, useEffect } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import QRCode from 'qrcode'
 
import Wallet from '../../services/wallet';

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption

import 'dotenv/config';

function SetMyNetwork(props) {

  const wallet = props.wallet;

  const [
    networks,
    setNetworks
  ] = useState(
    JSON.parse(
      localStorage.getItem('networks')
    )
  );

  const [
    validationMessage,
    setValidationMessage
  ] = useState(false);

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  const [
    network,
    setNetwork,
  ] = useState({});

  useEffect(() => {
    //console.log('sssssssssssssss useEffect ssssssssssss ::', exportData);
    console.log('useEffect', network);
    localStorage.setItem('network', JSON.stringify(network));
  }, [network]);

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Set My Network</Card.Title>
          { (validationErrors.length > 0) &&
            <Card.Title className="mb-2 p-3 text-warning"> 
              Validation Error:
              <Alert key="warning" variant="warning">
                {validationErrors.map((error) => <div>{error}</div>)}
              </Alert>
            </Card.Title>
          }
          <div>
            <Form>

              <Container>
	      {/* <Container ref={el=>this.componentRef=el}> */}

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Select Your Default Network
                  </div>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Form.Group controlId="formBasicSelect">
                    <Form.Label>Select Network</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={e => {
                        if (e.target.value !== '') {
                          //alert(e.target.value);
                          setNetwork(networks[e.target.value]);
                          props.networkCallback(
                            e.target.value
                            //networks[e.target.value]
                          );
                        }
                      }}
                    >
                      <option value="">Select Network</option>
                      {networks.map((_network, _index) => {
                        return (<option key={_index} value={_index}>{_network.name}</option>)
                      })}
                    </Form.Control>
                  </Form.Group>
                </Row>

              </Container>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
                      //value={network}

export default SetMyNetwork;
