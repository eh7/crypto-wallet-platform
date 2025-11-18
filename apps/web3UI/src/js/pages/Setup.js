/*
 * import Head from "next/head";
import Container from "react-bootstrap/Container";
import AppGuides from "@/components/AppGuides";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExampleComponents from "@/components/ExampleComponents";
*/

//export class App extends React.Component {
//  public render() {
//  }
//}

import React from 'react';
import ReactDOM from 'react-dom';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Wallet from '../services/wallet';

import pageSetup from '../setup';

export default class Setup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      provider: {},
      wallet: {},
    };
    pageSetup();
  }

  componentDidMount() {

    this.state.wallet = new Wallet();

    document.title = `You clicked ${this.state.count} times`;

    //alert('componentDidMount')
  }

  componentDidUpdate() {
    
    document.title = `You clicked ${this.state.count} times`;

    //alert('componentDidUpdate')
  }

  enterKeystorePhrase = async () => {
    alert('enterKeystorePhrase');
  }

  exportKeystore = async () => {
     alert('exportKeystore');
  }

  importKeystore = async () => {
    alert('importKeystore');
  }

  saveKeystore = async () => {
    alert(
      'saveKeystore: ' + await this.state.wallet.saveKeystore()
    );
  }

  getKeystore = async () => {
    alert(
      'getKeystore: ' + await this.state.wallet.getKeystore()
    );
  }

  getAddress = async () => {
    alert(
      'address[0]: ' + await this.state.wallet.getAddress()
    );
  }

  getPhrase = async () => {
    alert(
      'Phrase: ' + await this.state.wallet.getNewPhrase()
    );
  }

  getBlockNumber = async () => {
    alert(
      //'blockNumber(): ' + await this.state.provider.getBlockNumber()
      'blockNumber(): ' + await this.state.wallet.getBlockNumber()
    );
  }

  render() {
    return (
      <>
        <h1>Setup</h1>

        <Button onClick={this.getPhrase}>getPhrase</Button> |
        <Button onClick={this.getAddress}>getAddress</Button> |
        <Button onClick={this.saveKeystore}>saveKeystore</Button> |
        <Button onClick={this.getKeystore}>getKeystore</Button> |
        <Button onClick={this.enterKeystorePhrase}>enterKeystorePhrase</Button> |

        <Button onClick={this.exportKeystore}>exportKeystore</Button> |
        <Button onClick={this.importKeystore}>importKeystore</Button> |
        <Button onClick={this.getBlockNumber}>getBlockNumber</Button> |

        <br/>
        <Button href="/setup/password">Password</Button> |
        <Button href="/setup/keystore/load">load keystore</Button> |
        <Button href="/setup/phrase">New Phrase</Button> |
        <Button href="/setup/phrase/import">Import Phrase</Button> |
        <Button href="/setup/seed">Seed</Button> |
        <Button href="/setup/import/keystore">Import Keystore</Button> |
        <Button href="/setup/export/keystore">Export Keystore</Button> |

        <br/>
        <br/>
        keyset: {
          localStorage.getItem("keyset") ?
          <h3>user already setup {localStorage.getItem("keyset")}</h3> :
          <h3>setup user</h3>
        }

        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </>
    );
  }
}

//          <Card>
//            <Card.Body>
//            </Card.Body>
//          </Card>
