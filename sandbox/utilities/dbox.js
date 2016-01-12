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
	var root = "dbox";

	var fs      = require("fs");
	var app_cfg = JSON.parse(fs.readFileSync(__dirname + "/../tasks/dbox/configs/" + root + "/app.json"));
	var access_token = JSON.parse(fs.readFileSync(__dirname + "/../tasks/dbox/configs/" + root +"/access_token.json"));
	var dbox  = require("dbox");
	var app   = dbox.app(app_cfg);

	var client = app.client(access_token);

    return client;
}
