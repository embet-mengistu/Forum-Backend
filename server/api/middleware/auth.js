const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    // ////this came from headers in the browser(go to networks,then u have login inorder to get the network,then click on the network that u logged in and scroll until u get request headers,then u will find the x-auth-token )
    const token = req.header("x-auth-token");

    // //if there is no token,it means they are not logged in,bc token is only given when they are logged in,so it will deny them...
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token,authorization denied" });
    // ////else gn check if it its valid or not expired and then if it verified it returns all the data such as the user id
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log(verified);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "token verification failed,authorization denied" });
    // //this is were we can access to userid
    req.id = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = auth;
