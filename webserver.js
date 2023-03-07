const express = require('express');
const app = express();
const router = express.Router();
const path = require('path')

module.exports = function () {
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  app.use('/', router)
  router.get('/lol', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  app.use('/lol', router);
  app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + '/index.html');
  });
  let server = app.listen(3000, function() {
    console.log("App server is running on port 3000");
  });
}