var express = require('express');

var app = express()
  .use(express.static(__dirname + '/../frontend_prototype'));

// setup environments
app.configure('development', function() {
    app.use(express.logger('dev'));
});

app.configure('production', function() {

});

app.get('/foo', function(req, res) {
    res.send('foobar\n');
});

app.listen(3000);