 
# Claims

Claims is a simple Decentralized Application (DApp) integrated with a solidity smart contract to add users to a beneficiary list and users can come to claim their benefit - only beneficiary can claim their benefit. 

## Description
This program is a Dapp created using a javascript framework for connecting to the blockchain - ethers.js and some javascript codes. On the frontend, there are 2 frames on the right and left. The left frame is where the owner inputs the user information to add user to the list of beneficiaries while the right frame is used by the user to claim benefits and also check their balance after claiming their benefit.

# Getting Started

## Installing

- Clone the project from [Claims](https://github.com/rilwan12oye/Abalanche-DApp) by typing ```git clone https://github.com/rilwan12oye/Abalanche-DApp.git``` in your terminal.
- After cloning the project, ```cd``` into the project and type ```npm i``` to install all dependencies for the project
- Deploy your contract on your preferred chain, preferably on Avalance. Set up your hardhat.config file to be able to deploy on your preferred network. run ```npx hardhat run scripts/deploy.js --network <YOUR_NETWORK>``` to deploy
- Once your contract is deployed, copy the contract address and head to index.js, add the contract address here
  ```javascript
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  ```
- When the contract address is added, run ```npm run dev``` to start your frontend
- Once the frontend is up, interact with the contract.

## Authors

Rilwan Oyewole

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
