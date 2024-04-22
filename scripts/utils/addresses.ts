import { EVMChainIds } from './chains'

const tokenAddresses = {} as Record<number, string>

tokenAddresses[EVMChainIds.FANTOM_TESTNET] = '0x4C4F0334D7ACE843D920258ce26cFd02afD15b94'
tokenAddresses[EVMChainIds.BSC_TESTNET] = '0x4C4F0334D7ACE843D920258ce26cFd02afD15b94'
tokenAddresses[EVMChainIds.BASE_TESTNET] = '0x04AE18EE0961990f4e013dC918eed163F7fbBE07'

tokenAddresses[EVMChainIds.ETHEREUM_MAINNET] = '0x69bBC3F8787d573F1BBDd0a5f40C7bA0Aee9BCC9'
tokenAddresses[EVMChainIds.POLYGON_MAINNET] = '0x086373fad3447F7F86252fb59d56107e9E0FaaFa'
tokenAddresses[EVMChainIds.BASE_MAINNET] = ''

const tokenManagerAddresses = {} as Record<number, string>

tokenManagerAddresses[EVMChainIds.FANTOM_TESTNET] = '0x227eC1e841501E53975Bf83411F535B29B9d07D8'
tokenManagerAddresses[EVMChainIds.BSC_TESTNET] = '0x9F979CcAB1A7425AA45D81F5F6ce2c352dC8e91f'
tokenManagerAddresses[EVMChainIds.BASE_TESTNET] = '0x24A88F20263c88877F92b65b4A652F5f84C30f80'

tokenManagerAddresses[EVMChainIds.ETHEREUM_MAINNET] = ''
tokenManagerAddresses[EVMChainIds.POLYGON_MAINNET] = ''
tokenManagerAddresses[EVMChainIds.BASE_MAINNET] = ''

const tokenManagerSalts = {} as Record<number, string>

tokenManagerSalts[EVMChainIds.FANTOM_TESTNET] = '0xe04619199c018565c704b231332aee10574a123dc1b2ab6bd8fdbfa1d8eccaa4'
tokenManagerSalts[EVMChainIds.BSC_TESTNET] = '0x3201c3cd228580884cfb8eecb6d3142a9177c7e19abdcb25538362ba1af708b1'
tokenManagerSalts[EVMChainIds.BASE_TESTNET] = '0x2ba7ce9d7ea4d2e862150538a85c243fc4fc74b5bbbe9ed18adedeff723ce566'

tokenManagerSalts[EVMChainIds.ETHEREUM_MAINNET] = ''
tokenManagerSalts[EVMChainIds.POLYGON_MAINNET] = ''
tokenManagerSalts[EVMChainIds.BASE_MAINNET] = ''

const tokenIds = {} as Record<number, string>

tokenIds[EVMChainIds.FANTOM_TESTNET] = '0x52e8b0fcd3a12b4b18cac4c30aecd942b86dea3368ce9ffd944c62bb9439e5ca'
tokenIds[EVMChainIds.BSC_TESTNET] = '0x486ac5a0a68ad8924f546b7df6470c7d2aed06839d71a6c7be6e20453c6056ad'
tokenIds[EVMChainIds.BASE_TESTNET] = '0xe5b19d3609eea05f6c76b774981eb5c2713c5552e493726c65fb5dd51b6d4456'

tokenIds[EVMChainIds.ETHEREUM_MAINNET] = ''
tokenIds[EVMChainIds.POLYGON_MAINNET] = ''
tokenIds[EVMChainIds.BASE_MAINNET] = ''

const owner = "0x01Ca6f13E48fC5E231351bA38e7E51A1a7835d8D";

const BASE_FAUCET_TESTNET = '0xBD596d016081454D1868A86441443342a4f3D888'

export  const getAddresses = () => {
    return {
        tokenAddresses,
        tokenManagerAddresses,
        tokenManagerSalts,
        tokenIds,
        BASE_FAUCET_TESTNET,
        owner
    }
}