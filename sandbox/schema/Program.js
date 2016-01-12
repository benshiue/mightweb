exports = module.exports = function(app, mongoose) {
    var programSchema = new mongoose.Schema({
        title: { type: String, default: '' },
        lecture: { type: String, unique: true },
        duration: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        date: { type: Date, default: Date.now }, // updated date
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now }  // created date
        },
        type: { type: String, default: 'video' },
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        views: { type: Number, default: 0 },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
        search: [String]
    });
    programSchema.plugin(require('./plugins/pagedFind'));
    programSchema.index({ title: 1 });
    programSchema.index({ lecture: 1 });
    programSchema.index({ search: 1 });
    programSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Program', programSchema);
};
