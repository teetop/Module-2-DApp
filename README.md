 
# ERC20

ERC20 is a simple ERC-20 smart contract with a functional decentralized application (DApp) integrated with the smart contract. The smart contract mimics the standard ERC-20 smart contract where the owner can mint tokens for the user, the user can transfer tokens, check the balance, and burn no-longer-needed tokens.

## Description
This program is a Dapp created using a javascript framework to connect to the blockchain - ethers.js and some javascript codes. On the front-end, there are 2 frames on the right and left. The left frame is basically for the admin where the owner mints tokens and checks the total supply, though anyone can check the total supply while the right frame is where users can transfer tokens, check their balance, and burn their tokens.

# Getting Started

## Installing

- Clone the project by typing ```git clone https://github.com/teetop/Module-2-DApp``` in your terminal.
- After cloning the project, ```cd``` into the project and type ```npm i``` to install all dependencies for the project
- Deploy your contract on your preferred chain, preferably on Avalanche. Set up your hardhat.config file to be able to deploy on your preferred network. run ```npx hardhat run scripts/deploy.js --network <YOUR_NETWORK>``` to deploy
- Once your contract is deployed, copy the contract address and head to index.js, add the contract address here
  ```javascript
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  ```
- When the contract address is added, run ```npm run dev``` to start your frontend
- Once the front-end is up, interact with the contract.

## Authors

Temitope Taiwo

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
