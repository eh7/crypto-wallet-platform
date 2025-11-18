import React from 'react';
import ReactDOM from 'react-dom';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ImportAppData from '../components/Form/ImportAppData';

import Wallet from '../services/wallet';

import pageSetup from '../setup';

export default class SetupImportData extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keystore: null,
      wallet: {},
    };
    this.state.wallet = new Wallet();
    const storedNetworks = JSON.parse(localStorage.getItem('networks'))
    this.state.networks = storedNetworks;
    this.getKeystore()
    pageSetup();
  }

  componentDidMount() {
    console.log('zzzzzzzzzzzzzzzzzz', this.state);
  }

  getKeystore = async () => {
    this.state.keystore = await this.state.wallet.getKeystoreJson();
    this.setState(this.state);
  }

  render() {
    return (
      <>
        <h1>SetupImportData</h1>
        <>
          {(this.state.keystore !== null) ? <ImportAppData keystore={this.state.keystore} networks={this.state.networks}/> : (<span>Loading</span>)}
        </>
      </>
    );
  }
}

          //{(this.state.keystore !== null) ? (this.state.keystore) : (<h6>loading</h6>)}

//          <Card>
//            <Card.Body>
//            </Card.Body>
//          </Card>
