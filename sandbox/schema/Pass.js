exports = module.exports = function(app, mongoose) {
    var passSchema = new mongoose.Schema({
        subject: { type: String, default: '' },
        description: { type: String, default: ''},
        // 已報名 (TODO: remove 應該是多餘的)
        subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        // 開啟的票券
        tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
        date: { type: Date, default: Date.now }, // updated date  

        // Connect: MailChimp List ID
        mailchimpListId: { type: String, default: '' },

        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },        
    });
    passSchema.plugin(require('./plugins/pagedFind'));
    passSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Pass', passSchema);
}
