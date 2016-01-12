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

var httpProxy = require('http-proxy');

module.exports = function(addresses) {
    // Reverse Proxy
    var options = {
      hostnameOnly: false,
      router: {
        '/api/lesson/info': 'www.mokoversity.com'
      }
    };

    var proxy = httpProxy.createProxyServer(options);

    require('http').createServer(function(req, res) {
        var host = req.headers.host ? req.headers.host : '';
        var url = req.url;

        if (/^\/api/.test(url)) {
            return proxy.web(req, res, { target: 'http://www.mokoversity.com' });
        }

        if (/^\/1/.test(url)) {
            return proxy.web(req, res, { target: 'http://www.mokoversity.com' });
        }

        proxy.web(req, res, { target: 'http://localhost:3000' });
    }).listen(4000);;

}
