// boiler plate for starting server
const express = require("express");
const app = express();
const PORT = 4000;

// setting up our controller constant
const routesController = require("./controllers/routes");

// importing express
app.use(express.json());

// static html page that is accessible in the public folder
app.use(express.static(`${__dirname}/public`));

//  any traffic coming in that has routes in the URL will go to the routes controller for more routing options.
app.use("/routes", routesController);
// for Rob's way. will use rob instead of routes
app.use("/rob", require("./controllers/rob"));
console.log(__dirname);

// boiler plate for starting server
app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
