const { WebIrys } = require("@irys/sdk");
const { ethers } = require("ethers");
const Irys = require("@irys/sdk");

async function uploadToIrys(text) {
  const getIrys = async () => {
    const url = "https://node2.irys.xyz";
    const providerUrl = "";
    const token = "ethereum";
    const irys = new Irys({
      url,
      token,
      key: process.env.PRIVATE_KEY,
      config: { providerUrl },
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
    const receipt = await irys.upload(text, { tags });
    return receipt.id;
  } catch (e) {
    console.log("Error uploading data ", e);
  }
}

module.exports = { uploadToIrys };
