// App.js
import { Routes, Route } from 'react-router-dom';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import NavMain from './components/Nav/Main';

import Home from './pages/Home';
import Data from './pages/Data';
import About from './pages/About';
import Applications from './pages/Applications';
import SendTx from './pages/Send';

import ConfNetwork from './pages/Conf/Network';
import ConfPhraseSeedHex from './components/Conf/PhraseSeedHex';
//import LocalStorage from './components/Conf/LocalStorage';
import LocalStorage from './components/Form/LocalStorage';

import Setup from './pages/Setup';
import SetupAddress from './pages/SetupAddress';
import SetupPhrase from './pages/SetupPhrase';
import SetupPassword from './pages/SetupPassword';
import SetupPhraseImport from './pages/SetupPhrase';
import SetupSeed from './pages/SetupSeed';
import SetupImportKeystore from './pages/SetupImportKeystore';
import SetupExportKeystore from './pages/SetupExportKeystore';
import SetupExportData from './pages/SetupExportData';
import SetupImportData from './pages/SetupImportData';
import SetupLoadKeystore from './pages/SetupLoadKeystore';
import SetupSSS from './pages/SetupSSS';
import SetupSSSGenerator from './pages/SetupSSSGenerator';

//import Network from '/components/Conf/Network'; 

import AllABI from './pages/AllABI';

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  /*
  const setTitle = () => {
    console.log('zzzzzzzzzzzzzzzzzzzzz', window.location.pathname);
    document.title = "testing";
  }  

  setTitle();
  alert(1234);
  */

  const liveNetworks = JSON.parse(localStorage.getItem("networks"));
  const liveNetwork = JSON.parse(localStorage.getItem("network"));
  const liveSeedHex = JSON.parse(localStorage.getItem("seedHex"));

  //console.log('xxxxxxxxxxxxxxxxxx', typeof liveNetworks);
  //console.log('xxxxxxxxxxxxxxxxxx', liveNetwork, Object.keys(liveNetworks || {}).length);
//  return (
//    <>
//      <Container>
//        <Row><h1>LocalStorage</h1></Row>
//        <Row><LocalStorage/></Row>
//      </Container>
//    </>
//  );

  if (Object.keys(liveNetworks || []).length === 0) {
    //alert('Nav/Main no live networks - direct to network setup')
    return (
      <>
        <Container>
          <Row><h1>Configure Networks</h1></Row>
          <Row className="p-3">
            <h5>no "networks" data detected</h5>
            <h6>setup your default "networks" data</h6>
            <ConfNetwork type='init'/>
          </Row>
        </Container>
      </>
    );
  }
  if (Object.keys(liveNetwork || {}).length === 0) {
    console.log('yyyyxxxxxxxxxx', liveNetworks[0]);
//    alert('Nav/Main no live network - direct to network setup')
    localStorage.setItem(
      'network',
      JSON.stringify(
        liveNetworks[0]
      )
    );
/*
    return (
      <>
        <h5>no "network" data detected</h5>
        <h6>setup your default "network" data</h6>
      </>
    );
*/
  }
  if (Object.keys(liveSeedHex || {}).length === 0) {
    alert('no seedHex setup');
    return (
      <>
        <Container>
          <Row><h1>Configure pharase or seedHex</h1></Row>
          <Row className="p-3">
            <h6>setup your default "phrase" or "seedHex" data</h6>
            <ConfPhraseSeedHex type='init'/>
          </Row>
        </Container>
      </>
    );
  }


  return (
    <>
       <NavMain/>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/about" element={<About />} />
          <Route path="/applications" element={<Applications />} />

          <Route path="/contract/ballot" element={<AllABI contractName="Ballot" />} />
          <Route path="/contract/ballotDev" element={<AllABI contractName="BallotDev" />} />
          <Route path="/contract/oracleSample" element={<AllABI contractName="OracleSample" />} />
          <Route path="/contract/dai" element={<AllABI contractName="Dai" />} />
          <Route path="/contract/eh7token" element={<AllABI contractName="Eh7Token" />} />
          <Route path="/contract/etherWallet" element={<AllABI contractName="EtherWallet" />} />
          <Route path="/contract/groth16VerifierSquare" element={<AllABI contractName="Groth16VerifierSquare" />} />
          <Route path="/contract/multiPaymentChannelsDev" element={<AllABI contractName="MultiPaymentChannelsDev" />} />
          <Route path="/contract/vote" element={<AllABI contractName="Vote" />} />
          <Route path="/contract/notes" element={<AllABI contractName="Notes" />} />

          <Route path="/send" element={<SendTx />} /> 
          <Route path="/config/network" element={<ConfNetwork />} /> 
          <Route path="/setup" element={<Setup />} /> 
          <Route path="/setup/address" element={<SetupAddress />} /> 
          <Route path="/setup/export/data" element={<SetupExportData />} /> 
          <Route path="/setup/import/data" element={<SetupImportData />} /> 
          <Route path="/setup/password" element={<SetupPassword _new={true}/>} /> 
          <Route path="/setup/phrase" element={<SetupPhrase _new={true}/>} /> 
          <Route path="/setup/phrase/import" element={<SetupPhrase _new={false} />} /> 
          <Route path="/setup/seed" element={<SetupSeed />} /> 
          <Route path="/setup/import/keystore" element={<SetupImportKeystore />} /> 
          <Route path="/setup/export/keystore" element={<SetupExportKeystore />} /> 
          <Route path="/setup/keystore/load" element={<SetupLoadKeystore />} /> 
          <Route path="/setup/localStorage" element={<LocalStorage />} /> 
          <Route path="/setup/sss" element={<SetupSSS />} /> 
          <Route path="/setup/sss/generator" element={<SetupSSSGenerator />} /> 
       </Routes>
    </>
 );
};
//          <Route path="/products" element={<Applications />} />
//          <Route path="/about" element={<About />} />

export default App;
