import {
    AxelarQueryAPI,
    Environment,
    EvmChain,
    GasToken,
  } from "@axelar-network/axelarjs-sdk"

import crypto from "crypto";
  
import {interchainTokenServiceContractABI} from "../abis/interchainTokenServiceABI" 
import  { tokenAbi } from "../abis/tokenAbi"
import { getAddresses } from "./utils/addresses";
import { ethers, upgrades } from "hardhat";

  const MINT_BURN = 4;
  
  const interchainTokenServiceContractAddress =
    "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
  
  const test = process.env.IS_TEST === 'true'

  
  let { YUPTOKEN_SAMPLE_FANTOM_PROXY, 
    YUPTOKEN_SAMPLE_BNB_PROXY, 
    TM_SALT, TOKEN_MANAGER,
    YUPTOKEN_SAMPLE_BASE_PROXY,
    owner,
    TOKEN_ID
   } = getAddresses( !test )


  const fantomToken = YUPTOKEN_SAMPLE_FANTOM_PROXY
  const bnbToken = YUPTOKEN_SAMPLE_BNB_PROXY
  const baseToken = YUPTOKEN_SAMPLE_BASE_PROXY

  if (!fantomToken || !bnbToken) {
    throw new Error("Token addresses not found")
  }


  async function getSigner() {
    const [signer] = await ethers.getSigners();
    return signer;
  }

  async function getContractInstance(contractAddress: string, contractABI: any, signer: any) {
    return new ethers.Contract(contractAddress, contractABI, signer);
  }

async function deployTokenManager() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );

  const salt = "0x" + crypto.randomBytes(32).toString("hex");

  const defaultAbiCoder = ethers.AbiCoder.defaultAbiCoder();

  const params = defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, fantomToken]
  );

  // Deploy the token manager
  const deployTxData = await interchainTokenServiceContract.deployTokenManager(
    salt,
    "",
    MINT_BURN,
    params,
    ethers.parseEther("0.01")
  );

  // Get the tokenId
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    salt
  );

  // Get the token manager address
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log(
    `
	Salt: ${salt},
	Transaction Hash: ${deployTxData.hash},
	Token ID: ${tokenId},
	Expected token manager address: ${expectedTokenManagerAddress},
	`
  );
}

const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

// Estimate gas costs
async function gasEstimator() {
  const gas = await api.estimateGasFee(
    EvmChain.FANTOM,
    EvmChain.BINANCE,
    GasToken.FTM,
    750000,
    1.2
  );

  return gas;
}

async function deployRemoteTokenManager() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  // Get the InterchainTokenService contract instance
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );

  const defaultAbiCoder = ethers.AbiCoder.defaultAbiCoder();

  const params = defaultAbiCoder.encode(
    ["bytes", "address"],
    [signer.address, bnbToken]
  );

  const gasAmount = await gasEstimator();
  console.log("Estimated gas amount: ", gasAmount, "Salt: ", TM_SALT, "Params: ", params, "Token: ", bnbToken);
  let deployTxData: any;
  try {
  // Deploy the token manager
  deployTxData = await interchainTokenServiceContract.deployTokenManager(
    TM_SALT, // change salt
    "binance",
    MINT_BURN,
    params,
    ethers.parseEther("0.01"),
    { value: gasAmount }
  );

} catch (error: any) {
  // console.log("Error deploying token manager: ", error)
  console.log(interchainTokenServiceContract.interface.parseError(error.data))
  return;
}

  console.log("Deploying token manager...");

  // Get the tokenId
  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    signer.address,
    TM_SALT
  );

  // Get the token manager address
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log(
    `
	Transaction Hash: ${deployTxData.hash},
	Token ID: ${tokenId},
	Expected token manager address: ${expectedTokenManagerAddress},
	`
  );
}

async function transferMintAccessToTokenManagerOnFantom(token: string, tokenManagerAddr: string) {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const tokenContract = await getContractInstance(
    token,
    tokenAbi,
    signer
  );

  // Get the minter role
  const getMinterRole = await tokenContract.MINTER_ROLE();

  const grantRoleTxn = await tokenContract.grantRole(
    getMinterRole,
    tokenManagerAddr
  );

  console.log("grantRoleTxn: ", grantRoleTxn.hash);
}


async function transferTokens() {
  // Get a signer to sign the transaction
  const signer = await getSigner();

  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  );
  const gasAmount = await gasEstimator();
  let transfer: any;
  try {
  transfer = await interchainTokenServiceContract.interchainTransfer(
    TOKEN_ID,
    "base-sepolia",
    owner,
    ethers.parseEther("100"), 
    "0x",
    ethers.parseEther("0.01"), // gasValue
    {
      // Transaction options should be passed here as an object
      value: gasAmount,
    }
  );
  } catch (error: any) {
    console.log(interchainTokenServiceContract.interface.parseError(error.data))
  }

  console.log("Transfer Transaction Hash:", transfer.hash);
}

transferTokens().then(() => {
  console.log("Tokens transferred successfully");
});