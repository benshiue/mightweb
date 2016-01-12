/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/** ports from views/camp/index.js */

exports.init = function(req, res, next) {
	var userinfo = {};

	userinfo = {
		email: (typeof(req.user) === 'undefined') ? '' : req.user.email
	};

    res.render('training/' + req.params.course, {
    	userinfo: userinfo
    });
};


/* req.user:
{ _id: 51c7b9e04471c752cbf7e089,
  email: 'jollen@moko365.com',
  password: 'd1746a966321ec8af90ca1ee17d5c4faf6bc4b445b0c2980d8af3d4d9a5b659d45ae238cd512000b92afdb242ccd4ce7ccaea0d14d2ff486899e6cd19fa863e5',
  username: 'jollen',
  search: [],
  timeCreated: Mon Apr 14 2014 13:02:02 GMT+0800 (CST),
  isActive: true,
  roles: 
   { admin: 
      { _id: 51c7b9e0d198fa47a9ad577f,
        search: [],
        timeCreated: Mon Apr 14 2014 13:02:02 GMT+0800 (CST),
        permissions: [],
        groups: [Object],
        name: [Object],
        user: [Object] },
     account: 
      { _id: 51c7b9e0d198fa47a9ad5780,
        search: [Object],
        lastLoggedin: Fri Apr 11 2014 22:06:45 GMT+0800 (CST),
        userCreated: [Object],
        notes: [],
        statusLog: [Object],
        status: [Object],
        zip: '',
        phone: '095659089',
        company: '',
        name: [Object],
        verificationToken: '',
        isVerified: '',
        user: [Object] },
     mentor: true } }
 */
