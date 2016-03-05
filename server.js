var express = require('express');
var app = express();


app.post('/twillo', function(req, res) {
    console.log(req);
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, function(data) {
    console.log(data);
});
