import { ethers, upgrades } from "hardhat";
import { getAddresses } from "./utils/addresses";

const test = process.env.IS_TEST === 'true'
const isFantom = process.env.IS_FANTOM === 'true'
const isBsc = process.env.IS_BSC === 'true'
const isBase = process.env.IS_BASE === 'true'

let { YUPTOKEN_SAMPLE_FANTOM_PROXY, YUPTOKEN_SAMPLE_BNB_PROXY, YUPTOKEN_SAMPLE_BASE_PROXY, owner } = getAddresses( !test )

const mintAddressess = [
  "0x01Ca6f13E48fC5E231351bA38e7E51A1a7835d8D",
  "0x50cca5ed8b4455fbe316785269fc82500b67fd48",
]

const mintAmount = 5000

export const deployOrUpdateYupTokenSample = async (token: string, test = true) => {

    const args = [owner]
    
    const Contract = await ethers.getContractFactory("YupTokenSample");
  
    let status = "deployed"
    


    const existing = token && await ethers.getContractAt("YupTokenSample", token) || null
    let contractAddress = token
 
  
    if (!existing) {
      const contract = await upgrades.deployProxy(Contract, args, {
        initializer: 'initialize',
        kind: 'uups'
      });
    
      contractAddress = await contract.getAddress()

    } else {
      upgrades.upgradeProxy(existing, Contract)
      status = "upgraded"
      contractAddress = token
    }
    
    console.log(
      `Contract [ YupTokenSample ] [${status}] to: ${contractAddress}`
    );

    for (let i = 0; i < mintAddressess.length; i++) {
      const contract = await Contract.attach(contractAddress)
      const mintArgs =  [mintAddressess[i], ethers.parseEther(mintAmount.toString())]
      console.log("Minting to: ", mintAddressess[i])
      const tx = await contract.mint(...mintArgs)
    }
  }


async function main() {
  console.log("Deploying contracts..., test: ", test, " isFantom: ", isFantom)

  if (isFantom) {
    await deployOrUpdateYupTokenSample(YUPTOKEN_SAMPLE_FANTOM_PROXY, test)
  } else if (isBsc) {
    await deployOrUpdateYupTokenSample(YUPTOKEN_SAMPLE_BNB_PROXY, test)
  } else if (isBase) {
    await deployOrUpdateYupTokenSample(YUPTOKEN_SAMPLE_BASE_PROXY, test)
  } else {
    console.log("Invalid network")
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
