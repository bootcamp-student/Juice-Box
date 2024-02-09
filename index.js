require('dotenv').config();

const { PORT = 3000 } = process.env;
console.log(process.env.JWT_SECRET);


const express = require('express');
const server = express();
const path = require('path');

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
});


server.use(express.static(path.join(__dirname, 'public')));

const apiRouter = require('./backend/api');
server.use('/api', apiRouter);

const { client } = require('./backend/db');
client.connect();

server.listen(PORT, () => {
    console.log("The server is up on port", PORT);
});
