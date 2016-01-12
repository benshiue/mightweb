exports = module.exports = function(app, mongoose) {
    var captionSchema = new mongoose.Schema({
        isActive: { type: Boolean, default: true },

        idea: { type: String, default: '' },
        founder: { type: String, default: ''},
        description: { type: String, default: ''},
        facebook: { type: String, default: ''},
        github: { type: String, default: ''},
        twitter: { type: String, default: ''},
        email: { type: String, default: ''},

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        date: { type: Date, default: Date.now }, // updated date
        
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },        
    });
    captionSchema.plugin(require('./plugins/pagedFind'));
    captionSchema.index({ search: 1 });
    captionSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Idea', captionSchema);
}