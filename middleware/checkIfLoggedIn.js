const jose = require("jose"); // Assuming you are using node-jose library

const checkIfLoggedInMiddleware = async (req, res, next) => {
  try {
    console.log("req. heraders", req.headers);
    const authToken = req.headers.authorization.replace("Bearer ", "");
    console.log("the auth token is: ", authToken);
    const algorithm = "ES256";
    const spki = `-----BEGIN PUBLIC KEY-----
  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEJOn3FC1B4XBEAdgI+AatI+boOIsczVi1bQVTxnkI32kWHb0B4u9kHQkxwcoAlGrjZQHwSW8y7BXH8iXa3oe3sQ==
  -----END PUBLIC KEY-----`;

    const verificationKey = await jose.importSPKI(spki, algorithm);

    console.log("the verification key is: ", verificationKey);
    try {
      console.log("before the payload");
      const payload = await jose.jwtVerify(authToken, verificationKey, {
        issuer: "privy.io",
        audience: process.env.PRIVY_APP_ID,
      });
      const privyDID = payload.sub;
      if (!privyDID == req.body.userDiD) {
        throw new Error("Not authorized");
      }
    } catch (error) {
      console.log("there was an error", error);
      console.log("the error is: ", error);
    }

    next();
  } catch (error) {
    console.log("The user is not authorized");
    res.status(401).json({ message: "Not authorized" }); // Sending 401 for unauthorized requests
  }
};

module.exports = checkIfLoggedInMiddleware;
