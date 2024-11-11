const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const serverless = require('serverless-http');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err) {
    if (err) {
        console.log("error!! " + err);
    } else {
        console.log("MongoDB Connection Successful");
    }
});

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', async function(req, res) {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        if (!planetData) {
            return res.status(404).send("Error in Planet Data");
        }
        res.send(planetData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error in Planet Data");
    }
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
    fs.readFile('oas.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/os', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
});

app.get('/live', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
});

app.get('/ready', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
});

app.listen(3000, () => { console.log("Server successfully running on port - " + 3000); });
module.exports = app;

//module.exports.handler = serverless(app);