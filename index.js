const express = require("express");
bodyParser = require("body-parser");

const config = require("./config");
const db = config.db;

const users = require("./routes/users");

const app = express();
const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

app.use('/api/v1', users);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
