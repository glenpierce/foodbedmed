var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');
var request = require('request');
var twilio = require('twilio');

var client = twilio('SK6006fe17574a7717ef1955d8aefd5141', 'Vwi4p1UCf2FAfrhA19JNmmWRlytXrnvk');
var twilio_number = "6042391736";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({    extended: true    }));
app.use(xmlParser());

app.post('/twilio', twilio.webhook({
validate: false
}), function(req, res) {

    var uri = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
         req.param('Body')
         + "&key=" + process.env.KEY;

    console.log(req.param('Body'));

    request(uri, function(err, resp) {
        console.log(err, resp);
        var twiml = new twilio.TwimlResponse();
        var json = JSON.parse(resp.body);
        console.log(JSON.stringify(json.results[0].geometry.location));
        twiml.message(JSON.stringify(json.results[0].geometry.location));
        res.send(twiml);
    });
});

app.listen(process.env.PORT || 3000, function(data) {
    console.log('server running.');
});
