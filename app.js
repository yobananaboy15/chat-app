const express = require("express");

const app = express();

app.use(express.static);

const port = 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
