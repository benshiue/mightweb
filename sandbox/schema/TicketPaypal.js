exports = module.exports = function(app, mongoose) {
    var ticketSchema = new mongoose.Schema({
        // 是否為有效票？需完成付款才為有效票
        // How: 必須 Execute Payment 後才為有效
        isVerified: { type: Boolean, default: false },

        // 是否已使用？
        isActive: { type: Boolean, default: true },

        // updated date
        date: { type: Date, default: Date.now },

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

        // The PayPal's payment response
        paypal: {
            id: { type: String, default: '' },
            create_time: { type: Date, default: Date.now },
            update_time: { type: Date, default: Date.now },
            state: { type: String, default: '' },
            intent: { type: String, default: '' },
            payer: {
                payment_method: { type: String, default: '' }
            },
            links: {
                self: { type: String, default: '' },
                approval_url: { type: String, default: '' },
                execute: { type: String, default: '' }
            }
        }    
    });

    ticketSchema.plugin(require('./plugins/pagedFind'));
    ticketSchema.set('autoIndex', (app.get('env') == 'development'));
    app.db.model('TicketPaypal', ticketSchema);
}
