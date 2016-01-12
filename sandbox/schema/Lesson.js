exports = module.exports = function(app, mongoose) {
    var lessonSchema = new mongoose.Schema({
        name: { type: String, unique: true },
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
        programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program'}],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        date: { type: Date, default: Date.now }, // updated date
        author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        tag: [{ type: String  }],
        search: [String]
    });
    lessonSchema.methods.isFollowed = function(user) {
        return !!user && this.followers.indexOf(user.id) !== -1;
    };
    lessonSchema.plugin(require('./plugins/pagedFind'));
    lessonSchema.index({ name: 1 });
    lessonSchema.index({ title: 1 });
    lessonSchema.index({ tag: 1 });
    lessonSchema.index({ search: 1 });
    lessonSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Lesson', lessonSchema);
};
