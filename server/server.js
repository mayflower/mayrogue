var express = require('express');

var app = express()
  .use(express.logger('dev'))
  .use(express.static(__dirname + '/../frontend_prototype'));


app.get('/foo', function(req, res) {
    res.send('foobar\n');
});

app.listen(3000);