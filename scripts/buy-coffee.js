// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//Return the Ethere balance of a  given address
async function getBalance(address) {
  const balanceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);  
}

// Log the Ether banances for the list  of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo  of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper}, (${tipperAddress}) said "${message}"`);
  }
}

async function main() {
  // Get example accounts
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  // Get the contract to deplay and deplay
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffe deployed to: ", buyMeACoffee.address);

  // Check balance before the coffee purchase 
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== Start ==");
  await printBalances(addresses); 

  // Buy the owner a few coffees 
  const tip = {value: ethers.utils.parseEther("1")};
    //Conecting to the smart contract to the BuyMeACoffee funtion to get the _name and _messages var
  await buyMeACoffee.connect(tipper).buyCoffee("Jay", "Amazing!", tip); 
  await buyMeACoffee.connect(tipper2).buyCoffee("Barry", "Awesome to learn more about Blockchain!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Confie Queen", "To the moon.", tip);

  // Check balance after coffee purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw  funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw funds
  console.log("== withdrawTips ==");
  await printBalances(addresses);
  // Read all the memos left for the owner
  console.log("== memos ==")
  const  memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
