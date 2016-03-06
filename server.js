var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({    extended: true    }));
app.use(xmlParser());

app.post('/twilio', function(req, res) {
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, function(data) {
    console.log('server running.');
});
