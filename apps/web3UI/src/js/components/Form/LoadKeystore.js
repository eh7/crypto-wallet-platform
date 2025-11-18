import { useState, useEffect } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
 
import Wallet from '../../services/wallet';

function FormLoadKeystore({_subtitle, _new}) {

//  const [validated, setValidated] = useState(false);

  const wallet = new Wallet();

  const [
    validationMessage,
    setValidationMessage
  ] = useState(false);

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  useEffect(() => {
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    //alert("handleSubmit");
    //setValidationMessage(false);
    //setValidationErrors([]);

    const form = event.currentTarget;

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
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Load Keystore Form</Card.Title>
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
                  Load Keystore                    
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
                      placeholder="Password"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <Button variant="primary" type="submit">
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

export default FormLoadKeystore;
