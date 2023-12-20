const { PrivyClient } = require("@privy-io/server-auth");

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

module.exports = privy;
