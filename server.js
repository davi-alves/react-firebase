var express = require('express');
var _port = 3000;

express()
  .set('view engine', 'ejs')
  .use(express.static('./public'))
  .use(require('./accounts'))
  .get('*', function(req, res) { // for any request render the index template
    res.render('index', {
      user: JSON.stringify(req.session.user || null)
    });
  })
  .listen(_port, function () {
    console.log('Listening on port ' + _port);
  });
