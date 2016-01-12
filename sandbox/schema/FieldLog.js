
// Field Log Subsystem (自訂表單欄位系統)
exports = module.exports = function(app, mongoose) {
    var fieldLogSchema = new mongoose.Schema({
        // The code of this field. For example, 'android-wear' 
        // Place course name here if this system is used at Ticket system.
        code: { type: String, default: '' },

        // field name, eg. 'username', 'email', and etc.
        field: { type: String, default: ''},

        // the value of this field.
        value: { type: String, default: ''},

        // update date
        date: { type: Date, default: Date.now },

        // deleted ?
        isActive: { type: Boolean, default: true },

        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // create date
        },

        // You can put any reference document of this field here
        // according to your system design.
        passCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pass' },
            time: { type: Date, default: Date.now } // created date
        },     
    });

    app.db.model('FieldLog', fieldLogSchema);
}
