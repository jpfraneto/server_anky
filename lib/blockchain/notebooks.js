import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = provider.getSigner();

const notebookContract = new ethers.Contract(
  process.env.NOTEBOOK_CONTRACT_ADDRESS,
  NOTEBOOK_ABI,
  signer
);

export async function createNotebookTemplate(metadataURI, numPages) {
  // Call your smart contract's createNotebookTemplate method
  const tx = await notebookContract.createNotebookTemplate(
    metadataURI,
    numPages
  );
  await tx.wait();
  return tx.hash;
}
