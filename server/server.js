var connect = require('connect');

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static(__dirname + '/../frontend_prototype'))
 .listen(3000);
