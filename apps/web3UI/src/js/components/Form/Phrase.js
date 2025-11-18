import { useState, useEffect } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
 
import ReactToPrint from 'react-to-print';

import Wallet from '../../services/wallet';

function FormPhrase({_subtitle, _new, type}) {

//  const [validated, setValidated] = useState(false);

  const wallet = new Wallet();

  const [wordCount, setWordCount] = useState(12);

  const [phrase, setPhrase] = useState();
  const [phraseText, setPhraseText] = useState();
  const [isLoading, setIsLoading] = useState(true); 

  const [
    validationMessage,
    setValidationMessage
  ] = useState(false);

  const [
    validationErrors,
    setValidationErrors
  ] = useState([]);

  //const [password, setPassword] = useState();
  //const [passwordCheck, setPasswordCheck] = useState();

  useEffect(() => {
    setIsLoading(true);
    wallet.getNewPhraseForSeed().then((newPhrase) => {
      //setPhrase(newPhrase);
      setPhraseText(
        newPhrase
      );
      setPhrase(
        newPhrase.split(' ')
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
          { _new ?
            <Form.Control
              required
              type="text"
              placeholder={placeholder}
              value={phrase[i]}
            /> :
            <Form.Control
              required
              type="text"
              placeholder={placeholder}
            /> 
          }
        </Form.Group>
      );
             // value={_new ? phrase[i] : ''}
    }
    return content;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    //alert("handleSubmit");
    //setValidationMessage(false);
    //setValidationErrors([]);

    const form = event.currentTarget;

    const password = document.getElementById("formPassword")
    const passwordCheck = document.getElementById("formPasswordCheck")
console.log(password.value, " -- ", passwordCheck.value);
//console.log(password.value.length);
    
    if (password.value !== passwordCheck.value) {
      validationErrors.push("Password and Password Check Do Not Match");
      setValidationMessage(true);
    }
    if (password.value.length < 8) {
      validationErrors.push("Password Must be 8 Characters or More");
      setValidationMessage(true);
    }

    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return null;
    }

    const words = [];
    for(let i = 1; i <= form[0].value; i++) {
     words.push(form[i].value);
    }
    wallet.saveNewPhraseSeed(words, password.value, type);
  };

  const handleSelectChage = async (e) => {
    if (e.currentTarget.value) {
      getFormWordInputs(e.currentTarget.value);
      setWordCount(e.currentTarget.value);
    }
  }

  if (isLoading) return <div>Loading New Phrase...</div>;

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Secret Phrase Form</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {_new ? "Setup New Phrase" : "Import Your Phrase"}
          </Card.Subtitle>
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
                  Secret Phrase                    
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
                { _new ?
                  <Row className="mb-0 pl-3 pt-0">
                    <div className="pt-0 text-muted">
                      {phraseText}
                    </div>
                  </Row> :
                  ''
                }
                <Row className="mb-3">
                  {getFormWordInputs(wordCount)}
                </Row>

                <Row className="pl-3 pb-3 pt-0">

                  <ReactToPrint
                    trigger={() => {
                      return(<Button  variant="link">print phrase</Button>)
                    }}
                    content={() => this.componentRef}
                    documentTitle="Secret Phrase"
                    pageStyle="print"
                  />
                </Row>

                <Row className="mb-0 pl-3 pt-3">
                  <div className="pt-3 text-primary h3">
                    Password & Password Check
                  </div>
                </Row>
                <Row className="mb-0 pl-3 pt-0">
                  <div className="pt-0 text-muted">
                    This is used to to give access to your keystore in the future.
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
                  <Form.Group className="mb-3" controlId="formPasswordCheck">
                    <Form.Control
                      required
                      type="password"
                      placeholder="Password Check"
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

/*
  return (
    <Card>
      <Card.Body>
        <Card.Title>Secret Phrase Form</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
         {_subtitle}
        </Card.Subtitle>
        <Card.Text>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
      
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Text>
      </Card.Body>
    </Card>
  );
*/
}

export default FormPhrase;
