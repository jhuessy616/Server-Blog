
// boiler plate for starting server
const express = require("express");
const app = express();
const PORT = 4000;

// TODO this might change as this is the controller 
const routesController = require("./controllers/routes");


app.use(express.json());

// static html page that is accessible in the public folder
app.use(express.static(`${__dirname}/public`));

// !TODO this might change. different controller
//  any traffic coming in that has practice in the URL will go to the practice controller for more routing options. 
app.use("/routes", routesController);
console.log(__dirname);

// boiler plate for starting server
app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`);
})