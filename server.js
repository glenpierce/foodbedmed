var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');
var request = require('request');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({    extended: true    }));
app.use(xmlParser());

app.post('/twilio', function(req, res) {

    var uri = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
         req.param('Body')
         + "&key=" + process.env.KEY;

    request(uri, function(err, resp) {
        res.send(resp.body);
    });
});

app.listen(process.env.PORT || 3000, function(data) {
    console.log('server running.');
});
