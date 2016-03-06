var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var xmlParser = require('express-xml-bodyparser');
var request = require('request');
var twilio = require('twilio');

var parse = require('csv-parse');
var fs = require('fs');
var geolib = require('geolib');
var _ = require('lodash');
var request = require('request');

var client = twilio('SK6006fe17574a7717ef1955d8aefd5141', 'Vwi4p1UCf2FAfrhA19JNmmWRlytXrnvk');
var twilio_number = "6042391736";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(xmlParser());

var parser = parse({
    delimiter: '\t'
}, function(err, data) {

    data.shift();

    app.post('/twilio', twilio.webhook({
        validate: false
    }), function(req, res) {

        var uri = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            req.param('Body') + "&key=" + process.env.KEY;

        console.log(req.param('Body'));

        request(uri, function(err, resp) {

            console.log(err, resp);

            var twiml = new twilio.TwimlResponse();
            var json = JSON.parse(resp.body);

            var loc = json.results[0].geometry.location;

            var filtered = _.chain(data)
                .filter(function(v) {
                    var la = v[22];
                    var lo = v[23];
                    var dist = geolib.getDistance({
                        latitude: loc.lat,
                        longitude: loc.lng 
                    }, {
                        latitude: la,
                        longitude: lo
                    }, 1);

                    v.push(dist);

                    return dist < 1000;
                }).map(function(o) {
                    return {
                        name: o[3],
                        latitude: o[22],
                        longitude: o[23],
                        dist: o[o.length - 1]
                    }
                }).sortBy('dist').slice(0, 3).value();

            var a = _.map(filtered, function(o) {
                return o['name'] + o['dist'];
            });

            twiml.message(JSON.stringify(a));
            res.send(twiml);
        });
    });

    app.listen(process.env.PORT || 3000, function(data) {
        console.log('server running.');
    });
});

fs.createReadStream(__dirname + '/data.csv').pipe(parser);
