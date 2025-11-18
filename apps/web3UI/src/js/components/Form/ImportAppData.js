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

function ImportAppData(props) {

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
    const importData =  JSON.parse(
      document.getElementById("formImportData").value
    );

    console.log('sssssssssssssssssssss', importData.data);
    console.log('sssssssssssssssssssss', JSON.parse(importData.keystore[0]));

    const _keystore = JSON.parse(importData.keystore[1]);
    const _password = password;

console.log(_keystore, _password);

    const _key = await wallet.recoverHexFromSingleKeystore(_keystore, _password);
console.log(_key);
decrypt(importData.data, _key)

    //const this_key = (await wallet.getKeystoreWithPasswordKeystore(password, props.keystore)).substr(64);
    //const keystoreArray = importData.keystore;
    const keystoreArray = [
      JSON.parse(importData.keystore[0]),
      JSON.parse(importData.keystore[1]),
    ];
    //const keystore1 = JSON.parse(importData.keystore[0]);
    console.log(await wallet.getKeystoreWithPasswordKeystore(_password, keystoreArray));
console.log('keystoreArray', keystoreArray);
/*
      console.log(
        'decrypt mportData networks:',
        JSON.parse(
          decrypt(importData.data, _key)
        ),
      );
*/
    //const _key = await wallet.getKeystoreWithPasswordKeystore(_password, _keystore);
//    console.log('_key', _key);

    //console.log(password);
    //console.log(props);


    try {
/*
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
      //
 */

    } catch (e) {
      console.log('ERROR :: handleSubmit :: ', e);
      validationErrors.push(e);
      //setValidationMessage(true);
    }

    document.getElementById("submitButton").disabled = false;
  };

  const encrypt = (text, key) => {
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

  const decrypt = (text, key) => {
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
    const decrpted_object = JSON.parse(decrypted.toString('utf8'));

    console.log("networks", JSON.stringify(decrpted_object.networks));
    localStorage.setItem("networks", JSON.stringify(decrpted_object.networks));
    alert('set networks localStorage.setItem("networks", JSON.stringify(decrpted_object.networks))'); 

    console.log("keystore", JSON.stringify(decrpted_object.keystore));
    localStorage.setItem("keystore", JSON.stringify(decrpted_object.keystore));
    alert('set keystores localStorage.setItem("keystore", JSON.stringify(decrpted_object.networks))'); 

    wallet.initSetupWalletKeystore(key);

/*
console.log('decrypt :: ', text, key, this_key);
console.log('decrypted', decrypted.toString('utf8'));
console.log('decrypted JSON.parse::', decrpted_object);
    return decrypted.toString('utf8');
*/
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Import App Data</Card.Title>
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

                <div className="pt-3 text-primary h3">
                  Import App Data                     
                </div>

                <Row className="mb-0 pl-3 pt-3">
                  <textarea className="form-control" id="formImportData" rows="3"></textarea>
                </Row>


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

export default ImportAppData;
