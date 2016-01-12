exports = module.exports = function(req, options, cb) {
    var videoMetaServer = req.app.get('video-meta-server');

    var api = videoMetaServer + '/list';
    if (options.lecture) api = videoMetaServer + '/single?name=' + options.lecture;

    require('http').get(api, function(res) {
        if (res.statusCode !== 200) return;

        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var json = JSON.parse(body);
            if (json.error !== undefined) return cb(json.error, null);
            cb(null, json);
        });

    }).on('error', function(e) {
        cb(e, "Got error: " + e.message);
    });
};
