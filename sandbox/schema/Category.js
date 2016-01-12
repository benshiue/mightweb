exports = module.exports = function(app, mongoose) {
    var categorySchema = new mongoose.Schema({
        name: { type: String, unique: true },
        title: { type: String, default: '' },
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'}],
        date: { type: Date, default: Date.now }, // updated date
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },
        permissions: [{ type: String }], // admin, account, mentor
        search: [String]
    });
    categorySchema.plugin(require('./plugins/pagedFind'));
    categorySchema.index({ name: 1 });
    categorySchema.index({ title: 1 });
    categorySchema.index({ search: 1 });
    categorySchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Category', categorySchema);
};
