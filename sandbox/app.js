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

var cluster = require('cluster');

// cluster running at Amazon EC2 4-core with 32G RAM
// Running http server only on 127.0.0.1.
// Use reserve proxy to listen requests.
// Fork workers and loading-balance by http-proxy when run on master process.
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount;
    var addresses = [];
    var DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    if ('development' === process.env.NODE_ENV)
        cpuCount = 1;
    else
        cpuCount = require('os').cpus().length

    console.info('CPUs: ' + cpuCount);

    // Create a worker for each CPU
    var i;
    for (i = 0; i < cpuCount; i++) {
        var port = DEFAULT_PORT + i;
        cluster.fork({PORT: port});
        addresses.push({
            host: '127.0.0.1',
            port: port
        });
    }

    // Create a proxy server with custom application logic
    require('./proxy')(addresses);
} else {
    // Code to run if we're in a worker process

    var express = require('express'),
        i18n = require("i18n"),
        mongoStore = require('connect-mongo')(express),
        mongoose = require('mongoose'),
        passport = require('passport'),
        http = require('http'),
        path = require('path'),
        winston = require('winston'),           // logging module
        minify = require('express-minify');

    var app = express();

    // setup logger for express
    var logExpress  = winston.loggers.get('express');

    var logStream = {
        write: function(message, encoding){
            logExpress.info(message, { label: 'express'});
        }
    };

    //mongo uri
    app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/iptv-platform');

    //setup mongoose
    app.db = mongoose.createConnection(app.get('mongodb-uri'));
    app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
    app.db.once('open', function () {
        // console.log('mongoose open for iptv-platform');
    });

    //config data models
    require('./models')(app, mongoose);

    // config i18n
    i18n.configure({
        locales:['en', 'zh-tw', 'zh-cn', 'ja'],
        defaultLocale: 'zh-tw',
        // supportRegion: true, // not supported on i18n@0.4.1
        cookie: 'locale',
        directory: __dirname + '/locales',
        updateFiles: false
    });

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.use(express.compress());
    app.use(minify());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('wiki', __dirname + '/wiki');
    app.use(express.favicon());
    //app.use(express.logger('dev'));
    app.use(express.logger({stream: logStream}));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: process.env.SESSION_SECRET || 'Sup3rS3cr3tK3y',
        store: new mongoStore({ url: app.get('mongodb-uri') })
    }));

    app.use(require("connect-slashes")(false));
    app.use(i18n.init);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
        res.locals.currentURL = function(path) {
            var url = req.protocol + "://";
            if (path !== '') path = '/' + path;
            url += (req.get('host') + req.url + path).replace('//', '/');
            return url
        };
        res.locals.now = function() {
            return new Date().now;
        };
        res.locals.user = req.user;
        next();
    });
    app.use(app.router);

    // config drywall: global
    app.disable('x-powered-by');
    app.set('strict routing', true);
    app.set('project-name', 'Oranwind');
    app.set('project-title', 'Oranwind');
    app.set('company-name', 'Oranwind Inc.');
    app.set('system-email', 'benshiue@orangicetech.com, polo@orangicetech.com');
    app.set('crypto-key', process.env.CRYPTO_KEY || 'AQqA8ejsM4');
    app.set('require-account-verification', false);
    app.set('chromecast-key', '6527fc85-6bc8-42b0-af74-c38e3afc498d')
    app.set('video-server', 'http://videos.mokoversity.com');
    app.set('video-meta-server', 'http://static.moko365.com:3456');
    app.set('cdn-server', '');

    // config email (smtp) settings
    app.set('smtp-from-name', 'Mokoversity 開放創新學院');
    app.set('smtp-from-address', 'contact@moko365.com');
    app.set('smtp-credentials', {
        user: process.env.SMTP_USERNAME || 'camp@moko365.com',
        password: process.env.SMTP_PASSWORD || 'a7XUFY<W',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        ssl: /yes|true/.test(process.env.SMTP_USE_SSL) || true
    });

    // config socialable
    app.set('twitter-oauth-key', process.env.TWITTER_OAUTH_KEY || '1FN2txSEJUqZW7nvGoCwRQ');
    app.set('twitter-oauth-secret', process.env.TWITTER_OAUTH_SECRET || 'iIpA2gexGAnPFh7m41SWH3AzwSlBeTAak0UmOEdU');
    app.set('github-oauth-key', process.env.GITHUB_OAUTH_KEY || 'e0b039afa59446d0eec2');
    app.set('github-oauth-secret', process.env.GITHUB_OAUTH_SECRET || '12ecd5a3c57965092d61537359c7ef9e3fc93d5e');
    app.set('facebook-oauth-key', process.env.FACEBOOK_OAUTH_KEY || '581474091904335');
    app.set('facebook-oauth-secret', process.env.FACEBOOK_OAUTH_SECRET || '20f67d10a2d3bc95d8524cc8a4b643ea');

    // config error handler
    app.use(require('./views/http/index').http500);

    // global locals
    app.locals.projectName = app.get('project-name');
    app.locals.projectTitle = app.get('project-title');
    app.locals.copyrightYear = new Date().getFullYear();
    app.locals.copyrightName = app.get('project-name');
    app.locals.cdnServer = app.get('cdn-server');
    app.locals.videoServer= app.get('video-server');
    app.locals.cacheBreaker = '?20140130_4';
    app.locals.MOKOVERSITY_VERSION = 1.3

    // confing express in dev environment
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
        app.locals.pretty = true;
        app.locals.development = true;          // development mode
    }

    // to reflect req.protocol
    // see: http://stackoverflow.com/questions/10348906/how-to-know-if-a-request-is-http-or-https-in-node-js
    app.enable('trust proxy');

    require('./passport')(app, passport);
    require('./routes')(app, passport);
    require('./utilities')(app);

    http.createServer(app).listen(app.get('port'), '127.0.0.1', function() {
        var workerinfo = "";
        if (cluster.isWorker) workerinfo = ", on worker " + cluster.worker.id;
        console.info(app.locals.projectName + ' ' + app.get('env') + ' server listening on port ' + app.get('port') + workerinfo);
    });
}
