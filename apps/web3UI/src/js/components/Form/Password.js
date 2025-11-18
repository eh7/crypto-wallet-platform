import { useState, useEffect } from 'react';

import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
 
import ReactToPrint from 'react-to-print';

import Wallet from '../../services/wallet';

function FormPassword({_subtitle, _new}) {

//  const [validated, setValidated] = useState(false);

  const wallet = new Wallet();

  const [wordCount, setWordCount] = useState(12);

  const [password, setPassword] = useState();
  const [passwordText, setPasswordText] = useState();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    setIsLoading(true);
    wallet.getNewPasswordForSeed().then((newPassword) => {
      //setPassword(newPassword);
      setPasswordText(
        newPassword
      );
      setPassword(
        newPassword.split(' ')
      );
      setIsLoading(false);
    });
  }, []);

  const getFormWordInputs = (_wordCount) => {
    let content = [];
    for (let i = 0; i < _wordCount; i++) {
      const item = i;
      const controlId = "formWordInput" + i;
      const displayCount= i + 1;
      const lable = "Word " + displayCount;
      const placeholder = "enter word " + displayCount;
      content.push(
        <Form.Group className="mb-3 p-2" controlId={controlId}>
          <Form.Control
            required
            type="text"
            placeholder={placeholder}
            value={_new ? password[i] : ''}
          />
        </Form.Group>
      );
    }
    return content;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("handleSubmit");
    const form = event.currentTarget;

    const words = [];
    for(let i = 1; i <= form[0].value; i++) {
     words.push(form[i].value);
    }
    wallet.saveNewPasswordSeed(words);

//    if (form.checkValidity() === false) {
//      event.preventDefault();
//      event.stopPropagation();
//    }
//
//    setValidated(true);
  };

  const handleSelectChage = async (e) => {
    if (e.currentTarget.value) {
      getFormWordInputs(e.currentTarget.value);
      setWordCount(e.currentTarget.value);
    }
  }

  if (isLoading) return <div>Loading New Password...</div>;

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Secret Password Form</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {_new ? "Setup New Password" : "Import Your Password"}
          </Card.Subtitle>
          <div>
            <Form onSubmit={handleSubmit}>

              {/*<Container ref={el=>this.componentRef=el}>*/}
              <Container>

                <div className="pt-3 text-primary h3">
                  Secret Password                    
                </div>

                <Form.Group className="mb-3 pl-3 pt-4" controlId="formSelectNumberWords">
                  <Form.Label>Number of words</Form.Label>
                    <Form.Select aria-label="Select Number of Words" onChange={handleSelectChage}>
                      <option value="12">12</option>
                      <option value="16">16</option>
                      <option value="24">24</option>
                    </Form.Select>
                </Form.Group>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Words
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-0">
                  <div className="pt-0 text-muted">
                    {passwordText}
                  </div>
                </Row>
                <Row className="mb-3">
                  {getFormWordInputs(wordCount)}
                </Row>
              </Container>
              <Row className="pl-3 pb-3 pt-0">

              <ReactToPrint
                trigger={() => {
                  return(<Button  variant="link">print password</Button>)
                }}
                content={() => this.componentRef}
                documentTitle="Secret Password"
                pageStyle="print"
              />
              </Row>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
          <Card.Text>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default FormPassword;
