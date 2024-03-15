const contracts = [
  'Ballot',
  'Bespoke',
];

const networks = {
  1: "Ethereum Main Network",
  4: "Rinkebey Test Network",
  11155111: "Sepolia Test Network",
  80001: "Mumbai Polygon Test Network",
};

const networkBlockerUrls = {
  1: "etherscan.io",
  4: "rinkeby.etherscan.io",
  11155111: "sepolia.etherscan.io",
  80001: "mumbai.polygonscan.com",
};

const navbarHeaderBrand = "React Dapp:";
const navbarHeader = "Smart Contract ABI UI";

export {
  contracts,
  navbarHeader,
  navbarHeaderBrand,
  networks,
  networkBlockerUrls,
}
