import React, { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  capitalize,
} from "../../utils";

//const InputsArrayElement = () => {
function InputsArrayElement(props) {

  let latestId = 1;

  const [inputs, setInputs] = useState([
    { id: latestId, value: "" }
  ]);

  function handleInputOnChange(e, index) {
    const value = e.target.value;
    const newInputs = Object.assign([], inputs);
    inputs[index].value = value;
    setInputs(newInputs);
    props.onUpdateArrayData(inputs);
    /*
    console.log(value, inputs[index], newInputs);
    */
  }
      //<Form.Label>
      //  {capitalize(props.name)} ({props.type})
      //</Form.Label>

  return (
    <div>
      <div>
      <Button
        type='button'
        variant="outline-primary"
        onClick={() => {
          const newInputs = Object.assign([], inputs);
          latestId++;
          const id = latestId;
          newInputs.push({
            id,
            value: '',
          })
          setInputs(newInputs);
        }}
      >add</Button>
      </div>
      {inputs.map((input, index) => {
        return (
          <div key={index}>
            {/*<h4>{input.id} {index}</h4>*/}
            <Form.Control
              required
              key={index}
              value={inputs[index].value}
              onChange={(e) => handleInputOnChange(e, index)}
              placeholder={"Enter value " + index}
            />
          </div>
        );
	      {/*key={inputs[index].id}*/}
	      {/*placeholder={"Enter value " + index + "(" + index + ")"}*/}
      })}
      {
        (inputs.length > 1) &&
        <Button
          type='button'
          variant="outline-primary"
           onClick={() => {
            //alert('x button clicked')
            const newInputs = Object.assign([], inputs);
            newInputs.pop();
            setInputs(newInputs);
          }}
        >remove item</Button>
      }
    </div>
  );
      //<div>{JSON.stringify(inputs, null, 2)}</div>
};

export default InputsArrayElement;
