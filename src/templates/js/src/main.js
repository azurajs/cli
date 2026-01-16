const { AzuraClient } = require("azurajs");

const client = new AzuraClient();

client.get("/", (req, res) => {
  res.send("Hello World To AzuraJS!");
});

client.listen();
