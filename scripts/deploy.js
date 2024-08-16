
const hre = require("hardhat");
const {ethers} = require("ethers");

async function main() {

   const players = [
     "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
     "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
     "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
   ];

   const Game = await hre.ethers.getContractFactory("Game");
   const game = await Game.deploy(players);

   await game.deployed();


  console.log(`
  Game contract deployed to:
  ${game.address}
  `);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



