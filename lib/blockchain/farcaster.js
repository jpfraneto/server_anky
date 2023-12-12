const { NeynarAPIClient } = require("@neynar/nodejs-sdk");

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const {
  FeedType,
  FilterType,
} = require("@neynar/nodejs-sdk/build/neynar-api/v2");

const getCastsByFid = async (fid) => {
  try {
    console.log("inside the getCastsByFid function", fid);
    const hash = "0x8ffed4e8fa53c6e22b85f678c9a53067826e846a";
    console.log("the client is: ", client);
    console.log(client.clients.v2.apis);
    const cast = await client.lookUpCastByHash(hash);
    console.log("the cast is: ", cast);
    const user = await client.lookupUserByFid(fid);
    console.log("the user is: ", user);
    const memesChannelUrl =
      "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61";

    const result = await client.fetchFeedPage(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      parentUrl: memesChannelUrl,
      limit: 3,
    });
    console.log("THE RESULT IS: ", result);
    return { 123: 456 };
  } catch (error) {
    console.log("the error is: ", error);
  }
};

module.exports = { getCastsByFid };
