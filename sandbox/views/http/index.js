var fs = require('fs');
var ascii_logo = fs.readFileSync(__dirname + '/../../public/images/ascii/mokoversity-logo.txt');

exports.http404 = function(req, res){
  res.status(404);
  if (req.xhr) {
    res.send({ error: 'Resource not found.' });
  }
  else {
    res.render('http/404', {text: ascii_logo});
  }
};

exports.http500 = function(req, res){
    res.render('http/500');
};
