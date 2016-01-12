exports = module.exports = function(req, status, callback) {
    var statusToAdd = {
        id: 'account-' + status,
        name: status,
        userCreated: {
            id: req.user._id,
            name: req.user.username,
            time: new Date().toISOString()
        }
    };

    req.app.db.models.StatusLog.create(statusToAdd, function(err, statusLog) {
        if (err) console.log('something went wrong: status');

        var fieldsToSet = {
            status: statusToAdd,
            $push: { statusLog: statusLog._id }
        };

        if (status === 'loggedin') fieldsToSet.lastLoggedin = statusLog.userCreated.time;

        req.app.db.models.Account.findByIdAndUpdate(req.user.roles.account, fieldsToSet, function(err, account) {
            if (err) {
                console.log('something went wrong: status');
            } else {
                if (account === null) {
                    console.log(req.user);
                    console.log("something went wrong: can't find account to add status");
                }
                if (typeof callback !== 'undefined') callback();
            }
        });
    });
};
