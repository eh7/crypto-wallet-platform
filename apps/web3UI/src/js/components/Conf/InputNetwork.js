import { useState, useRef } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const InputNetwork = ({ networks, setNetworks, type }) => {
    
  const inputNetworkRef = useRef(null)
  const inputIdRef = useRef(null)
  const inputRpcUrlRef = useRef(null)
  const inputSymbolRef = useRef(null)
  const inputExplorerRef = useRef(null)
    
  const handleSubmit = (evt) => {
    evt.preventDefault()
    //setNetworks([...networks, inputNetworkRef.current.value ])
    setNetworks([...networks, {
      name: inputNetworkRef.current.value,
      chainId: inputIdRef.current.value,
      rpcUrl: inputRpcUrlRef.current.value,
      symbol: inputSymbolRef.current.value,
      explorer: inputExplorerRef.current.value,
    }])
    inputNetworkRef.current.value = ''

    if (type === 'init') {
      console.log('---------------> init done now reload');
      window.location.href='/';
    }
  }
    
  const handleDelete = (networkToDelete) => {
    setNetworks(() => networks.filter((network) => network !== networkToDelete))
  }

  return(
    <div>


      <div className="network-list-container">
        <Table responsive striped bordered hover size="sm">
          <thead>
            <tr>
              <th></th>
              <th>name</th>
              <th>chainId</th>
              <th>rcpUrl</th>
              <th>symbol</th>
              <th>explorerUrl</th>
            </tr>
          </thead>
          <tbody>

            {networks.length > 0 && networks.map((network)=> (
              <tr key={network.chainId}>
                <td><Button onClick={(evt) => {handleDelete(network)}}>X</Button></td>
                <td>{(network.name) ? network.name : network}</td>
                <td>{(network.chainId) ? network.chainId : 'no value'}</td>
                <td>{(network.rpcUrl) ? network.rpcUrl : 'no value'}</td>
                <td>{(network.symbol) ? network.symbol : 'no value'}</td>
                <td>{(network.explorer) ? network.explorer : 'no value'}</td>
                <td><Button onClick={(evt) => {handleDelete(network)}}>X</Button></td>
              </tr>
            ))}

          </tbody>
        </Table>
      </div>


      <form onSubmit={(evt) => {handleSubmit(evt)}}>
        <Form.Group className="mb-3 pr-3" controlId="formNetworkName">
          <Form.Control
            required
            type="text"
            placeholder="network name"
            ref={inputNetworkRef}
          />
        </Form.Group>
        <Form.Group className="mb-3 pr-3" controlId="formChainId">
          <Form.Control
            required
            type="text"
            placeholder="chain id"
            ref={inputIdRef}
          />
        </Form.Group>
        <Form.Group className="mb-3 pr-3" controlId="formRpcUrl">
          <Form.Control
            required
            type="text"
            placeholder="rpc url"
            ref={inputRpcUrlRef}
          />
        </Form.Group>
        <Form.Group className="mb-3 pr-3" controlId="formSymbol">
          <Form.Control
            required
            type="text"
            placeholder="symbol"
            ref={inputSymbolRef}
          />
        </Form.Group>
        <Form.Group className="mb-3 pr-3" controlId="formExploraUrl">
          <Form.Control
            required
            type="text"
            placeholder="explorer url"
            ref={inputExplorerRef}
          />
        </Form.Group>
        <Form.Group className="mb-3 pr-3" controlId="formExploraUrl">
          <Button
            variant="primary"
            type="submit"
            id="submitButton"
          >
            add network
          </Button>
        </Form.Group>
      </form>

    </div>
  )  
}

export default InputNetwork
