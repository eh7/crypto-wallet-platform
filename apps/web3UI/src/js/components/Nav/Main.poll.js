import { useState, useEffect } from 'react';

import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';

import NavDropdown from 'react-bootstrap/NavDropdown';

//import styled from 'styled-components';

import {
  DropdownSubmenu,
  NavDropdownMenu,
} from "react-bootstrap-submenu";

import Wallet from '../../services/wallet';

import NavAlert from './Alert';

/*
const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;
*/

function NavMain() {

  const wallet = new Wallet();

  //const [showSetNetwork, setShowSetNetwork] = useState(false);
  //const renderBackdrop = (props) => <Backdrop {...props} />;

  const [myAddress, setMyAddress] = useState('');
  const [myBalance, setMyBalance] = useState('');
  const [myNetwork, setMyNetwork] = useState('');

  const getAddress = async () => {
    const address = await wallet.getAddress();
    setMyAddress(
      address
    );
    console.log(myAddress);
    /*
    const pkey = await wallet.getPrivateKey();
    console.log(pkey);
    */
  }

  const setNetwork = (chainId) => {
    const networks = JSON.parse(localStorage.getItem('networks'));
    localStorage.setItem('myNetwork', chainId);
    console.log('Main.js :: setNetwork :: chainId ::', chainId);      
    //setMyNetwork(networks[chainId].name);
  }

  const selectNetwork = async () => {
    alert('selectNetwork');
//    const networks = JSON.parse(localStorage.getItem('networks'));
//    networks.map((_network, _i) => {
//      console.log('----------------> getNetwork :: chainId ::', _network.chainId);      
//    });
  }

  useEffect(() => {
    console.log('useEffect:', myAddress, myBalance, myNetwork);
  }, [myAddress, myBalance, myNetwork]);

  getAddress();
  
  const updateNetwork = (e) => {
    const networks = JSON.parse(localStorage.getItem('networks'));
    setNetwork(e.chainId);
    console.log(networks[e].name);
    window.location.reload();
  }

  const text = () => {
    return (
      <>
        <h6>this is some text.</h6>
      </>
    );
  }

  return (
    <Container as="main" className="py-4 px-3 mx-auto">


      <Row className="w-100">
        <Col sm="6">
          <Navbar className="rounded mb-0">
            <Navbar.Brand  href="/">
              <h2>Crypto Wallet Interface (Poll)</h2>
            </Navbar.Brand>
          </Navbar>
        </Col>
        <Col sm="6" className="small text-muted">
            {myAddress}
            <NavAlert wallet={wallet} action="setNetwork" heading="setNetwork" text="setNetwork" updateNetwork={updateNetwork}/>
        </Col>
      </Row>

      <div>
        <Navbar>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav variant="tabs" className="w-100" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/data">Data</Nav.Link>
              </Nav.Item>
	      {/*
              <Nav.Item>
                <Nav.Link href="/applications">Applications</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/about">About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/send">Send Tx</Nav.Link>
              </Nav.Item>
              */}
              <Nav.Item>
                <Nav.Link href="/poll">Poll</Nav.Link>
              </Nav.Item>
              {/*
              <Nav.Item>
                <NavDropdownMenu title="Contracts" id="contract-nav-dropdown">
                  <Nav.Link href="/contract/ballot">Ballot</Nav.Link>
                  <Nav.Link href="/contract/ballotDev">BallotDev</Nav.Link>
                  <Nav.Link href="/contract/oracleSample">OracleSample</Nav.Link>
                  <Nav.Link href="/contract/dai">Dai</Nav.Link>
                  <Nav.Link href="/contract/eh7token">Eh7Token</Nav.Link>
                  <Nav.Link href="/contract/etherWallet">EtherWallet</Nav.Link>
                  <Nav.Link href="/contract/groth16VerifierSquare">Groth16VerifierSquare</Nav.Link>
                  <Nav.Link href="/contract/multiPaymentChannelsDev">MultiPaymentChannelsDev</Nav.Link>
                  <Nav.Link href="/contract/notes">Notes</Nav.Link>
                  <Nav.Link href="/contract/vote">Vote</Nav.Link>
                  <Nav.Link href="/contract/voteSepolia">VoteSepolia</Nav.Link>
                  <Nav.Link href="/contract/pollSepolia">PollSepolia</Nav.Link>
                </NavDropdownMenu>
              </Nav.Item>
              */}
              <Nav.Item>
                <NavDropdownMenu title="Setup" id="setup-nav-dropdown">
                  <NavDropdown.Item href="/setup">Setup Overview</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/phrase">New Phrase</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/phrase/import">Load Phrase</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/keystore/load">Load Keystore</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/import/keystor">Import Keystore</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/address">Address</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/export/data">Export Application Data</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/import/data">Import Application Data</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/localStorage">Local Storage</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/sss">Shared Secret</NavDropdown.Item>
                  <NavDropdown.Item href="/setup/sss/generator">Shared Secret Generator</NavDropdown.Item>
                </NavDropdownMenu>
              </Nav.Item>

              <Nav.Item className="ml-auto">
                <Nav.Link href="/config/network">Network</Nav.Link>
              </Nav.Item>

            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

    </Container>
  );

      //<NavAlert wallet={wallet} action="setNetwork" heading="setNetwork Heading" text="setNetwork text"/>
      //<NavAlert wallet={wallet} action="showData" heading="showData Heading" text="showData text"/>
}

export default NavMain;
