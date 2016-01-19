'use strict';

var request = require('superagent');


exports.init = function(req, res){
  res.render('about/index');
};


exports.create = function(req, res){
	if (!req.body.lastname) res.send({ error: 'Please fill in lastname' }); ;
	if (!req.body.email) res.send({ error: 'Please fill in email' }); ;

	 var sreq = request.post('https://api2.autopilothq.com/v1/contact')
	           .set('autopilotapikey','4ab0f5292e5848e3902eab0d8e302804')
	           .auth('mmosconii@gmail.com', 'qwer123!')
		       .send({
	                    "contact": {
	                        "FirstName": "",
	                        "LastName": req.body.lastname,
	                        "Email": req.body.email
	                    }
	                });


    sreq.pipe(res);
    sreq.on('end', function(){
        console.log('Done.');
    });

};