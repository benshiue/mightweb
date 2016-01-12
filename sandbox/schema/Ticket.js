exports = module.exports = function(app, mongoose) {
    var ticketSchema = new mongoose.Schema({
        phone: { type: String, default: '' },
        // 六位數的驗證碼
        code: { type: String, default: '000000' },
        // 是否為有效票？需驗證號才為有效票
        isVerified: { type: Boolean, default: false },
        // 是否已使用？
        isActive: { type: Boolean, default: true },
        date: { type: Date, default: Date.now }, // updated date  
        // qrcode image tag
        qrcode: { type: String, default: '' },

        // The pass of this ticket 
        passCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pass' },
            time: { type: Date, default: Date.now } // created date
        },  
        
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, default: '' },
            time: { type: Date, default: Date.now } // created date
        },         
    });
    ticketSchema.plugin(require('./plugins/pagedFind'));
    ticketSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('Ticket', ticketSchema);
}
