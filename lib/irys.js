const { WebIrys } = require("@irys/sdk");
const { ethers } = require("ethers");
const Irys = require("@irys/sdk");

async function uploadToIrys(text) {
  const getIrys = async () => {
    const url = "https://node2.irys.xyz";
    const providerUrl = "";
    const token = "ethereum";
    const irys = new Irys({
      url, // URL of the node you want to connect to
      token, // Token used for payment
      key: process.env.PRIVATE_KEY, // ETH or SOL private key
      config: { providerUrl }, // Optional provider URL, only required when using Devnet
    });
    return irys;
  };
  const irys = await getIrys();
  const tags = [
    { name: "Content-Type", value: "text/plain" },
    { name: "application-id", value: "Anky Dementors" },
    { name: "container-type", value: "farcaster-notebook" },
  ];
  try {
    console.log("the text and tags are: ", text, tags);
    const receipt = await irys.upload(text, { tags });
    console.log("the receipt is: ", receipt);
    console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
    return receipt.id;
  } catch (e) {
    console.log("Error uploading data ", e);
  }
}

module.exports = { uploadToIrys };
