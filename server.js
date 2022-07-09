/////////////////////////////////////////
//      Dependencies
/////////////////////////////////////////

const express = require("express");

/////////////////////////////////////////
//      Instantiatition/Variables
/////////////////////////////////////////
PORT = 3050;

const app = express();

//////////////////////////////////////////
//      Test Route
//////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Test Connection");
});

//////////////////////////////////////////
//      Listener
//////////////////////////////////////////

app.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});
