exports = module.exports = function(app, mongoose) {
    var captionSchema = new mongoose.Schema({
        program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
        timeline: { type: Number, default: 0 },
        caption: { type: String, default: ''},
        isActive: { type: Boolean, default: true },
        date: { type: Date, default: Date.now },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now }
        }
    });
    captionSchema.plugin(require('./plugins/pagedFind'));
    captionSchema.index({ search: 1 });
    captionSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Caption', captionSchema);
}
