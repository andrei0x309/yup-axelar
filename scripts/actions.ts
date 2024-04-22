import { ethers } from "hardhat";
import { vars } from "hardhat/config"
import { EVMChainIds } from "./utils/chains";
import { getAddresses } from "./utils/addresses";

const PK = vars.get("PK")

const isTesting = process.env.IS_TEST === 'true'

let { tokenAddresses, owner, BASE_FAUCET_TESTNET } = getAddresses()

const MINT_AMOUNT = 5000;
const FAUCET_AMOUNT = 5000 * 1e3;

export const mintSample = async (address: string = owner, isFaucet = false) => {
      
     const Contract = await ethers.getContractFactory("YupTokenSample");
      
     
     // check if contract is already deployed
     let existing = tokenAddresses[EVMChainIds.BASE_TESTNET] && await ethers.getContractAt("YupTokenSample", tokenAddresses[EVMChainIds.BASE_TESTNET]) || null
     let contractAddress = tokenAddresses[EVMChainIds.BASE_TESTNET]
      
     if (!existing) {
        console.log("Contract yupTokenSample not deployed")
        return
     } 
      
        const contract = await Contract.attach(contractAddress)

        let mintAmount = MINT_AMOUNT

        if (isFaucet) {
            mintAmount = FAUCET_AMOUNT
            address = BASE_FAUCET_TESTNET
        }

        const mintArgs =  [address, ethers.parseEther(mintAmount.toString())]
        console.log("Minting...")

        const tx = await contract.mint(...mintArgs)

        console.log("Minted!, tx: ", tx.hash)
    
}

async function main() {
    await mintSample(owner, true)
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  