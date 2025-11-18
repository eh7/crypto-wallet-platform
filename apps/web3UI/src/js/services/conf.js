const contracts = [
  'Ballot',
  'BallotDev',
  'OracleSample',
  'Dai',
  'Eh7Token',
  'EtherWallet',
  'Bespoke',
  'Groth16VerifierSquare',
  'MultiPaymentChannelsDev',
  'Notes',
  'Vote',
  'VoteSepolia',
];

const contractsJson = {
  "Ballot": "../contracts/Ballot",
  "BallotDev": "../contracts/BallotDev",
  'OracleSample': "../constracts/OracleSample",
  "Dai": "../contracts/Dai",
  "Eh7Token": "../contracts/Eh7Token",
  "EtherWallet": "../contracts/EtherWallet",
  "Groth16VerifierSquare": "../contracts/Groth16VerifierSquare",
  "MultiPaymentChannelsDev": "../contracts/MultiPaymentChannels",
  "Vote": "../contracts/Vote",
  "VoteSeppolia": "../contracts/VoteSepolia",
  "Notes": "../contracts/Notes",
}

const networks = {
  1: "Ethereum Main Network",
  4: "Rinkebey Test Network",
  11155111: "Sepolia Test Network",
  80001: "Mumbai Polygon Test Network",
  31337: "hardhat - devEvmNode",
};

const networkBlockerUrls = {
  1: "etherscan.io",
  4: "rinkeby.etherscan.io",
  11155111: "sepolia.etherscan.io",
  80001: "mumbai.polygonscan.com",
  31337: "devEvmNode",
};

const navbarHeaderBrand = "React Dapp:";
const navbarHeader = "Smart Contract ABI UI";

export {
  contracts,
  contractsJson,
  navbarHeader,
  navbarHeaderBrand,
  networks,
  networkBlockerUrls,
}
