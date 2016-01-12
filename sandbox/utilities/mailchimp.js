/**
Copyright (C) 2014 Moko365 Inc. All Rights Reserved.

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

/*
 * Utility of tasks/dbox_*
 */
exports = module.exports = function(req, res) {
	// CONFIG
	var root = "mailchimp";

	// Read settings
	var fs      = require("fs");
	var app_cfg = JSON.parse(fs.readFileSync(__dirname + "/../tasks/mailchimp/configs/" + root + "/app.json"));

	// Get API instance
	var MailChimpAPI = require('mailchimp').MailChimpAPI;
	var apiKey = app_cfg.api_key;

	try {
	    var client = new MailChimpAPI(apiKey, { version : '2.0' });
	} catch (error) {
	    console.log("MailChimpAPI Error: " + error.message);
	}

    return client;
}
