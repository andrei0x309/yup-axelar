import { ethers } from "hardhat";
import { vars } from "hardhat/config"
import { getAddresses } from "./utils/addresses";

const PK = vars.get("PK")

const isTesting = process.env.IS_TEST === 'true'

let { YUPTOKEN_SAMPLE_FANTOM_PROXY, owner } = getAddresses()

const MINT_AMOUNT = 5000;

export const mintSample = async (address: string) => {
      
     const Contract = await ethers.getContractFactory("YupTokenSample");
      
     
     // check if contract is already deployed
     let existing = YUPTOKEN_SAMPLE_FANTOM_PROXY && await ethers.getContractAt("YupTokenSample", YUPTOKEN_SAMPLE_FANTOM_PROXY) || null
     let contractAddress = YUPTOKEN_SAMPLE_FANTOM_PROXY
      
     if (!existing) {
        console.log("Contract yupTokenSample not deployed")
        return
     } 
      
        const contract = await Contract.attach(contractAddress)

        const mintArgs =  [address, ethers.parseEther(MINT_AMOUNT.toString())]
        console.log("Minting...")

        const tx = await contract.mint(...mintArgs)

        console.log("Minted!, tx: ", tx.hash)
    
}

async function main() {
    await mintSample(owner)
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  