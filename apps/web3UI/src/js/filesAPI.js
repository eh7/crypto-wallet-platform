const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3333;

const http = require('http')
const https = require('https')

require('dotenv').config()

let server = null
if (process.env.PROD === 'true') {
  const privateKey  = fs.readFileSync(process.env.SSLCertificateKeyFile, 'utf8')
  const certificate = fs.readFileSync(process.env.SSLCertificateFile, 'utf8')
  const options = {
    key: privateKey,
    cert: certificate,
  }
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const host = (process.env.PROD === 'true') ? "zkws.org" : "localhost"
const mainDirPath = (process.env.PROD === 'true') ? '/var/tmp/files/' : '/tmp/files/'

console.log("PROD RUN", (process.env.PROD === 'true'))

//const Wallet = require('./services/wallet')
//const wallet = new Wallet();
const ethers = require('ethers')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.urlencoded({limit: '25mb'}))
app.use(bodyParser.json({limit: '25mb'}))

const objectsEqual = (o1, o2) =>
  Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p]);

const merge = (_array) => {
  const newArray = []
  _array.map((subArray) => {
    subArray.map((newItem) => {
      if (newArray.length === 0) {
        newArray.push(newItem)
      } else {
        let check = false
        newArray.map((checkItem, checkItemIndex) => {
          //console.log('check', checkItem, newItem, objectsEqual(checkItem, newItem))
          if (!check) {
            check = objectsEqual(checkItem, newItem)
          }
        })
        if (!check) {
          newArray.push(newItem)
        }
      }
    })
  })
  return newArray
}


/*
const merge = (a, b, predicate = (a, b) => a === b) => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
  return c;
}
*/

const prepareSyncData = async (
  _allFilesHashes,
  _files,
  _syncDataAddresses,
  _filesHashData,
  _filesEncryptedFilesData,
) => {
  console.log("prepareSyncData")
  try {
    _syncDataAddresses.map((dataAddress) => {
      const allFileHashes = []
      //const uniqueFileHashes = []
      console.log('process dataAddress:', dataAddress)  
      //
      // WIP
      // get all fileHashes for this sync dataAddress
      // create a uniquie list of fileHashes for this sync  dataAddress
      // copy all sync fileHashes and encryptedFilesData to the sync directory for that sync data/user address
      //
      _allFilesHashes.map((dataPair, index) => {
        const pairRef = [
          dataPair.addressData +
          '/' +
          dataPair.addressUser
        ]

//      const encryptedFiles = _filesEncryptedFilesData[pairRef].map((encryptedDataFile, index) => {
//        encryptedDataFile.index = index
//        return encryptedDataFile
//      })
//console.log(encryptedFiles)

        if (_filesHashData[pairRef]) {
          allFileHashes.push(_filesHashData[pairRef])
        }
      })
      //console.log('allFileHashes', allFileHashes)
      //console.log('allFileHashes.length', allFileHashes.length)

      const uniqueFileHashes = merge(allFileHashes)
      //console.log(uniqueFileHashes)

      const latestFiles = []
      let i = 0
      uniqueFileHashes.map((hashes, index) => {
        if (dataAddress !== hashes.addressData) {
        } else {
          const pairRef = hashes.addressData + '/' + hashes.addressUser
      
          const data = _filesEncryptedFilesData[pairRef][hashes.index]
          data.index = i
          i++
          latestFiles.push(data)

/*
          if (hashes.index === 2)
          console.log(
            'oldIndex:' + hashes.index,
            'newIdex:' + data.index,
            'iv:' + data.iv,
            'encryptedData:' + data.encryptedData,
            //'encryptedData:' + "data.encryptedData".substring(10),
          )
*/
        }
      })
//console.log(_filesEncryptedFilesData)

//      console.log('uniqueFileHashes', uniqueFileHashes)
//      console.log('latestFiles', latestFiles)
//      console.log('latestFiles[3]', latestFiles[3])

      const filePath = mainDirPath + dataAddress + '/latestFilesData.json';
      fs.writeFileSync(
        filePath,
        JSON.stringify(latestFiles),
        "utf8",
      )
      // console.log(123456, dataAddress, latestFiles.length)
    })
  } catch (err) {
    console.error('prepareSyncData', err)
  } 
}

const processBody = async (body) => {
  const bodyObj = JSON.parse(body)
  const signature = bodyObj.signature

  //const recoveredAddress = await wallet.recoverAddressFromMessage(bodyObj.data, bodyObj.signature);
  //console.log('processBody :: bodyObj.signature: ', bodyObj.signature, recoveredAddress)
  delete bodyObj.signature;
  console.log('processBody :: bodyObj.signature: ', bodyObj.signature, bodyObj)
  const tmpbodyObj = bodyObj
  const _message = ethers.keccak256(
    Buffer.from(
      JSON.stringify(
        tmpbodyObj
      )
    )
  )
  console.log('hashed _message:', _message)
  const digest = ethers.getBytes(ethers.hashMessage(_message))
  const signerRecoveredAddress = ethers.recoverAddress(digest, signature)
  console.log('signerRecoveredAddress', signerRecoveredAddress, bodyObj.addressUser, (signerRecoveredAddress === bodyObj.addressUser))
  if (signerRecoveredAddress !== bodyObj.addressUser) {
    console.error('signerRecoveredAddress error :: /publichNew :: processBody :: no match', signerRecoveredAddress)
    //console.error('signerRecoveredAddress error :: no match')
    return {}
  }

  

  const dirPath = mainDirPath + bodyObj.addressData + '/' + bodyObj.addressUser
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log('mkdirSync files db :: path:', dirPath)
    }
  } catch (err) {
    console.error('mkdirSync files db :: ERROR ::', err)
  }   

  bodyObj.hashes.map((hash, index) => {
    console.log(
      "CREATE DIR FOR DATA/USER:",
      dirPath,
      bodyObj.hashes[index],
    )
    try {
      const filesHashPath = dirPath + '/filesHashData.json'
      fs.writeFileSync(
        filesHashPath,
        JSON.stringify(bodyObj.hashes),
      )
      const filesEncryptedDataPath = dirPath + '/filesEncryptedFilesData.json'
      fs.writeFileSync(
        filesEncryptedDataPath,
        JSON.stringify(bodyObj.encryptedFiles),
      )
    } catch (err) {
      console.error('mkdirSync files db :: ERROR ::', err)
    }
  })
}

//app.listen(port, host, () => {
server.listen(port, host, () => {
  if (process.env.PROD === 'true') {
    console.log(`Server is running on https://${host}:${port}`)
  } else {
    console.log(`Server is running on http://${host}:${port}`)
  }
});

app.use((req, res, next) => {
  console.log("TODO: add middle ware to check owner and signature to authorise access to filesAPI!");
  next();
})

app.get('/latest/:dataAddress/:userAddress', function (req, res, next) {
  try {
    // Authorization
    const fmessage = req.headers['fmessage']
    const fsignature =  req.headers['fsignature']
     const data = JSON.stringify({
      addressData: req.params.dataAddress,
      addressUser: req.params.userAddress,
      now: fmessage,
      //now: Number(fmessage),
    })
    const hashedMessage = ethers.keccak256(
      Buffer.from(data)
    )

    // if authorized send latest data
    const digest = ethers.getBytes(ethers.hashMessage(hashedMessage))
    const signerRecoveredAddress = ethers.recoverAddress(digest, fsignature)
    //console.log(fmessage, data, hashedMessage, req.params.dataAddress)
    //console.log("signerRecoveredAddress:", signerRecoveredAddress)
    //console.log("signerRecoveredAddress:", signerRecoveredAddress, req.params.userAddress)

    if (signerRecoveredAddress !== req.params.userAddress) {
      console.error('signerRecoveredAddress error :: /latest :: no match', signerRecoveredAddress)
      //console.error('signerRecoveredAddress error :: no match', signerRecoveredAddress)
      res.status(500).send({ message: 'Error matching signature' });
      return {}
      //next() 
    }

    const dirPath = mainDirPath 
    const filePath = dirPath + req.params.dataAddress + '/latestFilesData.json';

    const readStream = fs.createReadStream(filePath);

    console.log("file stream to client done")

    readStream.pipe(res);
  
    readStream.on('error', (err) => {
      console.error(err);
      //res.status(500).send({ message: 'Error streaming file' });
      console.error('readStream.on error ', err)
    });

    readStream.on('done', () => {
      console.log("file stream to client done")

      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
 //       'Content-Disposition': 'attachment; filename="file.txt"'
      });
    })
  } catch (err) {
    console.error('recieve get("/latest/:dataAddress/:userAddress")', err)
  }

//  res.status(200).send(files)
//  res.status(200).json({
//    info: 'latest ' + req.params.dataAddress,
//    message: 'okay',
//    status: '200',
//    files1: "files1", 
//    files: files, 
//  })
})

app.get('/stats', function (req, res, next) {
  try {
    const fmessage = req.headers['fmessage']
    const fsignature =  req.headers['fsignature']
    const data = JSON.stringify({
      info: "stats",
      now: fmessage,
    })
    const hashedMessage = ethers.keccak256(
      Buffer.from(data)
    )
    const digest = ethers.getBytes(ethers.hashMessage(hashedMessage))
    const signerRecoveredAddress = ethers.recoverAddress(digest, fsignature)
    if (signerRecoveredAddress !== "0xF125Fe77570a4E51B16B674C95ace26fbE99164e" &&
        signerRecoveredAddress !== "0x7574b8D4C0C2566b671C530d710821EB6694bE0C" &&
        signerRecoveredAddress !== '0x9B2300Ba0B80E2044c840DeAfc5695b9ab7B168B') {
      console.error('signerRecoveredAddress error :: /stats :: no match', signerRecoveredAddress)
      res.status(500).send({ message: 'Error matching signature' });
      return {}
      //next()
    }
  }  catch (err) {
    console.error('ERROR :: app.get(/stats) :: checkSignature ::', err.message)
    res.status(500).send({ message: 'Error matching signature' });
    return {}
  }

  const dirPath = mainDirPath 
  const syncDataAddresses = []
  const syncUserAddresses = []
  const filesHashes = []
  const filesHashesJson = []
  const filesHashData = []
  const filesEncryptedFilesData = []

  fs.readdir(dirPath, { recursive: true }, (errror, files) => {
    files.map((file, index) => {

      const [addressData, addressUser] = file.split("/")

      if (addressUser && syncUserAddresses.indexOf(addressUser) === -1) {
        syncUserAddresses.push(addressUser)
      }

      if(addressData && syncDataAddresses.indexOf(addressData) === -1) {
        syncDataAddresses.push(addressData)
      }

      if (addressData && addressUser) {
        const data = {addressData, addressUser}
        let check = false
        filesHashes.map((fileHash) => {
          if (fileHash.addressData === addressData && fileHash.addressUser === addressUser) {
            check = true
          }
        })
        if (!check) {
          filesHashes.push(data)
        }
      }

      if (file.match(/filesEncryptedFilesData.json$/i)) {
        const pairRef = addressData + '/' + addressUser
//        filesEncryptedFilesData[
//          addressData +
//          '/' +
//          addressUser
//        ] = JSON.parse(fs.readFileSync(dirPath + file).toString('utf8'))
        filesEncryptedFilesData[pairRef] = JSON.parse(fs.readFileSync(dirPath + file).toString('utf8'))

// WIP :: TESTING
/*
console.log(filesEncryptedFilesData[pairRef][2])
const thisStringFiles = fs.readFileSync(dirPath + file)//.toString('utf-8')
//console.log(addressUser, '0x7574b8D4C0C2566b671C530d710821EB6694bE0C')
if (addressUser === '0x7574b8D4C0C2566b671C530d710821EB6694bE0C') {
//  console.log(addressUser, 'iv[0]:' + (JSON.parse(thisFile))[2].iv)
  const files = JSON.parse(thisStringFiles)
  console.log(
    addressUser,
    Object.keys(
      files
    ),
    Object.keys(
      files[2]
    ),
    '\nencryptedData:' + files['2']['encryptedData'],
    '\nindex:' + files['2']['index'],
    '\niv:' + files['2']['iv'],
  )
}
*/
// END TESTING
      }

      if (file.match(/filesHashData.json$/i)) {
        filesHashData[
          addressData +
          '/' +
          addressUser
        ] = JSON.parse(fs.readFileSync(dirPath + file).toString('utf8'))
      } 

      if (file.match(/^0x[0123456789abcdef]+\/0x[0123456789abcdef]+$/i)) {
        return { addressData, addressUser }
      }

    })
    //console.log({filesHashes})
    //console.log({filesHashData})
    //console.log(filesEncryptedFilesData)

    prepareSyncData(
      filesHashes,
      files,
      syncDataAddresses,
      filesHashData,
      filesEncryptedFilesData,
    ) 

    res.status(200).json({
      'info': 'getStats',
      files,
      syncUserAddresses,
      syncDataAddresses,
      filesHashes,
    })
  }) 
})

app.post('/publishNew', function (req, res, next) {
  let body = ''
  console.log('/publishNew', req.body)
//  const addressUser
//  const addressData
  let count = 0;
  req.pipe(fs.createWriteStream('/tmp/uploadFile'));
  req.on('data', (chunk) => {
    count++
    console.log(count, chunk);
    body += chunk
  });
  req.on('end', (next) => {
    const message = `data published!`
    //res.send(message);
    res.status(200).send(message)
    console.log("message:", message)
    //console.log("return body data:", body)
    processBody(body)
    //next
  });
});


app.post('/publish', (req, res) => {
  if (!req.body.address) {
    return res.status(400).json({ error: 'No body address' });
  }
  if (!req.body.addressData) {
    return res.status(400).json({ error: 'No body addressData' });
  }
  if (!req.body.sigData) {
    return res.status(400).json({ error: 'No body sigData' });
  }
  if (!req.body.data) {
    return res.status(400).json({ error: 'No body data' });
  }
  const directoryPath = mainDirPath + req.body.addressData;
  try {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
      console.log(`Directory '${directoryPath}' created.`);
    } else {
      console.log(`Directory '${directoryPath}' exists.`);
    }
  } catch (err) {
    console.error(err);
  }
  try {
    fs.writeFileSync(
      directoryPath  + '/' + req.body.addressData + ".json",
      JSON.stringify(req.body.data),
      "utf8",
    );
  } catch (err) {
    console.error(err);
console.log(req.body.data)
  }
  res.json({
    message: 'sync data published successfully',
    address: req.body.address,
    address: req.body.addressData,
    sigData: req.body.sigData,
    data: req.body.data,
  });
});

app.get('/retrieve', (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'sync data retrieve',
    filename: req.body.address,
    filename: req.body.addressData,
  });
});
