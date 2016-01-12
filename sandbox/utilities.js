'use strict';

exports = module.exports = function(app) {
    //create utility object in app
    app.utility = {};

    // Drywall: 2014.01.01
    app.utility.sendmail = require('./utilities/sendmail');

    //setup utilities
    app.utility.email = require('./utilities/email');
    app.utility.slugify = require('./utilities/slugify');
    app.utility.Workflow = require('./utilities/workflow');

    // add Status to account
    app.utility.addStatus = require('./utilities/addStatus');

    // get video meta from remote video server
    app.utility.videoMeta = require('./utilities/videoMeta');

    // DBox client utilities
    app.utility.dbox = require('./utilities/dbox');

    // twilio SMS client utilities
    app.utility.sms = require('./utilities/sms');

    // MailChimpAPI client utilities
    app.utility.mailchimp = require('./utilities/mailchimp');
};
