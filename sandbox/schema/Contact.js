exports = module.exports = function(app, mongoose) {
    var contactSchema = new mongoose.Schema({
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        message: { type: String, default: '' },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now }
        }
    });
    contactSchema.plugin(require('./plugins/pagedFind'));
    contactSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Contact', contactSchema);
}
