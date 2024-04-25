import { ethers } from "ethers";

// Function to compute the ID
function computeMarketParamsId(params) {
  // Convert each address to 32 bytes and numbers to a 32-byte hex string
  const loanToken = ethers.zeroPadValue(params.loanToken, 32);
  const collateralToken = ethers.zeroPadValue(params.collateralToken, 32);
  const oracle = ethers.zeroPadValue(params.oracle, 32);
  const irm = ethers.zeroPadValue(params.irm, 32);
  const lltv = ethers.zeroPadValue(ethers.toUtf8Bytes(params.lltv.toString()), 32);

  // Concatenate all the parameters
  const concatenatedParams =
    loanToken +
    collateralToken.slice(2) +
    oracle.slice(2) +
    irm.slice(2) +
    lltv.slice(2);

  // Compute the Keccak256 hash
  return ethers.keccak256(concatenatedParams);
}

// Example usage
const marketParams = {
  loanToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  collateralToken: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
  oracle: "0x224F2F1333b45E34fFCfC3bD01cE43C73A914498",
  irm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC",
  lltv: 860000000000000000n,
};

console.log("Computed ID:", computeMarketParamsId(marketParams));
