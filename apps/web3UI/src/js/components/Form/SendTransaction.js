import { useState, useEffect } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
 
import Wallet from '../../services/wallet';

function FormSendTransaction({_subtitle, _new}) {

//  const [validated, setValidated] = useState(false);

  const wallet = new Wallet();

  const [networks, setNetworks] = useState(
    JSON.parse(
      localStorage.getItem('networks')
    )
  );

  const [
    network,
    setNetwork,
  ] = useState(
    JSON.parse(
      localStorage.getItem('network')
    )
  );

  const [txReceiptShow, setTxReceiptShow] = useState(false);
  const [txReceipt, setTxReceipt] = useState({});

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  const [
    validationMessage,
    setValidationMessage
  ] = useState(false);

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  useEffect(() => {
    console.log('useEffect:', network);
    getBalance();
  }, [network]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    document.getElementById("submitButton").disabled = true;

    //alert("handleSubmit");
    //setValidationMessage(false);
    //setValidationErrors([]);

    const form = event.currentTarget;

    const from = await wallet.getAddress();
    const to = document.getElementById("formTo").value;
    const amount = document.getElementById("formAmount").value;

    const params = [{
      from: from,
      to: to,
      value: amount
    }];
    //console.log(params);

    const receipt = await wallet.sendTx(params);
    setTxReceipt(receipt);
    setTxReceiptShow(true);
    console.log('txReceipt', receipt, "setTxReceiptShow");

    document.getElementById("submitButton").disabled = false;

//    const transactionHash = await provider.send('eth_sendTransaction', params)
//    console.log('transactionHash is ' + transactionHash);

    /*
    const password = document.getElementById("formPassword")
    const passwordCheck = document.getElementById("formPasswordCheck")
//console.log(password.value, " -- ", passwordCheck.value);
//console.log(password.value.length);
    
    if (!password.value) {
      validationErrors.push("Enter a value for Password");
      setValidationMessage(true);
    }

    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return null;
    }

    wallet.getKeystoreWithPassword(password.value);
    */
  };

  const getBalance = async () => {
    const address = await wallet.getAddress();
    const balance = await wallet.getBalance(address);
    setAddress(address);
    setBalance(balance);
    //alert(address + ' :: ' + balance);
  }

  const openInNewTab = url => {
    const fullUrl = url;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

/*
                {(network.explorer) ? (
                  <Button variant="link" onClick={() => openInNewTab({network.explorer + "/tx/" + txReceipt.transactionHash})}>
                    block explorer
                  </Button>
                ) : (<>no explorer path</>)}
*/

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Send Transaction Form</Card.Title>
{/*
          { (txReceiptShow) ? (
            <Alert key="warning" variant="warning">
              <p className="h4 primary">Transaction Receipt</p>
              <p>hash: {txReceipt.transactionHash}</p>
              <p>blockNumber: {txReceipt.blockNumber}</p>
              <p>confirmations: {txReceipt.confirmations}</p>
              <p>gas: {txReceipt.gasUsed.toNumber()}</p>
              <p>
                {(network.explorer) ? (<p>
                  <Button variant="link" onClick={() => {
                      const url = network.explorer + "/tx/" + txReceipt.transactionHash;
                      openInNewTab(url);
                    }}
                  >block explorer</Button>
                </p>) : (<p>no network.explorer</p>)}
              </p>
              <Button variant="link" onClick={() => setTxReceiptShow(false)}>Hide Tx Info</Button>  
            </Alert>
            ) : (
              <>{(txReceipt.transactionHash) ? (<Button variant="link" onClick={() => setTxReceiptShow(true)}>Show TX Info</Button>) : (<></>)}</>
            )
          }
          { (validationErrors.length > 0) &&
            <Card.Title className="mb-2 p-3 text-warning"> 
              Validation Error:
              <Alert key="warning" variant="warning">
                {validationErrors.map((error) => <div>{error}</div>)}
              </Alert>
            </Card.Title>
          }
*/}
          <Card.Text>
            <div>
            <Form onSubmit={handleSubmit}>

{/*
              <Container ref={el=>this.componentRef=el}>
*/}
              <Container>

                <div className="pt-3 text-primary h3">
                  Send Transaction
                </div>

                <div className="pt-3 text-secondary h6">
                  {(network.name) ? (<p>
                    <p>network: {network.name}</p>
                    <p>address: {address}</p>
                    <p>balance: {balance}</p>
                  </p>) : (<p>No Network Selected</p>)} 
                </div>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    To 
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-3">
                  <Form.Group className="mb-3 pr-3" controlId="formTo">
                    <Form.Control
                      required
                      type="text"
                      placeholder="To"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Amount
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-3">
                  <Form.Group className="mb-3 pr-3" controlId="formAmount">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Amount"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Button variant="primary" type="submit" id="submitButton">
                    Submit
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
}

export default FormSendTransaction;
