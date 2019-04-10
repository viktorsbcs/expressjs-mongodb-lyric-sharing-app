const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
  res.send("HELLO1");
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
