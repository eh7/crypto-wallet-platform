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

function ExportAppData(props) {

  const wallet = new Wallet();

  const [
    exportData,
    setExportData
  ] = useState({});

  const [
    validationMessage,
    setValidationMessage
  ] = useState(false);

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  useEffect(() => {
//                    {JSON.stringify(exportData)}
//                  <textarea class="form-control" id="formTextarea" rows="3"></textarea>
    document.getElementById("formTextarea").value = JSON.stringify(exportData);

    console.log('sssssssssssssss useEffect ssssssssssss ::', exportData);
  }, [exportData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (document.getElementById("submitButton").disabled) {
      alert("disabled");
      return;
    }

    document.getElementById("submitButton").disabled = true;

    const password = document.getElementById("formPassword").value;
    //console.log(password);
    //console.log(props);


    try {
      //const this_key = await wallet.getKeystoreWithPassword(password);
      const this_key = (await wallet.getKeystoreWithPasswordKeystore(password, props.keystore)).substr(64);
      //console.log(this_key);
      //const newPhrase  = await this.getNewPhraseForSeedOperation();

      console.log('xxxxxxxxxxxxxxxxx', this_key.length, this_key);

       //const text = encrypt(JSON.stringify(props.networks), this_key);
      const text = encrypt(JSON.stringify(props), this_key);
      console.log(
        'encrypt networks:',
        text,
      );

//      console.log('DDDDDDDDDDDD', {
      setExportData({
        data: text,
        keystore: props.keystore,
      });  

      console.log(
        'decrypt networks:',
        JSON.parse(
          decrypt(text, this_key)
        ),
      );

      //encrypt("this is some text", key);

    } catch (e) {
      console.log('ERROR :: handleSubmit :: ', e);
      validationErrors.push(e);
      //setValidationMessage(true);
    }

    document.getElementById("submitButton").disabled = false;
  };

  encrypt = (text, key) => {
    //const this_key = Buffer.from(process.env.KEY, 'hex');
    console.log(key.length, key);
    const this_key = Buffer.from(key, 'hex');
    //const this_iv = Buffer.from(process.env.IV, 'hex');
    const this_iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this_key),
      this_iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this_iv.toString('hex'),
      encryptedData: encrypted.toString('hex')
    };
  }

  decrypt = (text, key) => {
    const this_key = Buffer.from(key, 'hex');
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    console.log(this_key.length, this_key);
    let decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this_key),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Export App Data</Card.Title>
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
                  Export App Data                     
                </div>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Password
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-3">
                  <Form.Group className="mb-3 pr-3" controlId="formPassword">
                    <Form.Control
                      required
                      type="password"
                      placeholder="password"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Button variant="primary" type="submit" id="submitButton">
                    Submit
                  </Button>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                    {JSON.stringify(exportData)}
                  <textarea class="form-control" id="formTextarea" rows="3"></textarea>
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

export default ExportAppData;
