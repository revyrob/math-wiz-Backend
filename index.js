const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(200);
});
app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});
