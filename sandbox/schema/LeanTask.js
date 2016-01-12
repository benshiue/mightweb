
// Lean Task
exports = module.exports = function(app, mongoose) {
    var subscriptionSchema = new mongoose.Schema({

        // the lesson code of this task, eg. '101'
        code: { type: String, default: '' },

        // task objective, eg. 'how-to-gather-feedback'
        objective: { type: String, default: ''},

        // the owner idea of this task
        idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },

        description: { type: String, default: ''},

        // update date
        date: { type: Date, default: Date.now },

        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // create date
        }       
    });

    app.db.model('LeanTask', subscriptionSchema);
}
