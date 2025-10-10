import React from 'react';
import ReactDOM from 'react-dom';

import Container from "react-bootstrap/Container";
//import Footer from "react-bootstrap/Footer";
//
import pageSetup from '../setup';

export default class Applications extends React.Component {
  render() {
    pageSetup();
    return (
      <>
        <h1>Applications</h1>
      </>
    );
  }
}
