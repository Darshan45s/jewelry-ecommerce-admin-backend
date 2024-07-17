//Create server
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("./config/db");


const port = process.env.port || 7000;

/**
 * BODY PARSER
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/**
 * ROUTING PATH
 */
var adminRoute = require("./routes/adminRoute");
var vandorRoute = require("./routes/vandorRoute");

/**
 * END-POINT
 */
app.use("/api/admins", adminRoute);
app.use("/api/vandors", vandorRoute);


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
