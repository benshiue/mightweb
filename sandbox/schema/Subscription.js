exports = module.exports = function(app, mongoose) {
    var subscriptionSchema = new mongoose.Schema({
        subject: { type: String, default: '' },
        description: { type: String, default: ''},
        subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        newsletters: [{ type: String, default: ''}],
        date: { type: Date, default: Date.now }, // updated date        
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },        
    });
    subscriptionSchema.plugin(require('./plugins/pagedFind'));
    subscriptionSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Subscription', subscriptionSchema);
}
