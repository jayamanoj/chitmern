const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    billCustomerName: {
        type: String,
        required: [true, "Please enter the bill name"],
        trim: true,
        maxLength: [100, "Bill name cannot be more than 100 characters"],
    },
    date: {
        type: Date, 
        default: Date.now 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',                          
        required: true
    },
    saleList: [
        {
            item: {
                type: String,
                required: [true, "Sale item name is required"]
            },
            tamil: {
                type: String,
                required: [true, "Sale item name is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Sale item quantity is required"]
            },
            singlePrice: {
                type: Number,
                required: [true, "Sale item price is required"]
            },
            scall: {
                type: String,
                required: [true, "Sale item scall is required"]
            },
            bag: {
                type: Number,
                required: [true, "Sale item bag is required"]
            },
            bagRate: {
                type: Number,
                required: [true, "Sale item bag rate is required"]
            },
            wage: {
                type: Number,
                required: [true, "Sale item wage is required"]
            },
            commission: {
                type: Number,
                required: [true, "Sale item commission is required"]
            },
            freight: {
                type: String,
                required: [true, "Sale item freight is required"]
            },
            amount: {
                type: Number,
                required: [true, "Sale item amount is required"]
            },
            bagDetails: {
                type: Number,
                required: [true, "Sale item bag details are required"]
            }
        }
    ],
    balance: {
        type: String,
        required: [true, "Please enter the balance"],
        maxLength: [100, "Balance cannot be more than 100 characters"],
    },
    debit: {
        type: Number,
        required: [true, "Debit amount is required"]
    },
    credit: {
        type: Number,
        required: [true, "Credit amount is required"]
    },
    bagTotalAmount: {
        type: Number,
        required: [true, "Bag total amount is required"]
    },
    wageTotalAmount: {
        type: Number,
        required: [true, "Wage total amount is required"]
    },
    commissionTotalAmount: {
        type: Number,
        required: [true, "Commission total amount is required"]
    },
    freightTotalAmount: {
        type: String,
        required: [true, "Freight total amount is required"]
    },
    subTotal: {
        type: String,
        required: [true, "Subtotal is required"]
    },
    total: {
        type: String,
        required: [true, "Total is required"]
    },
    billSerialNumber: {
        type: Number
    }
}, { timestamps: true });

// Pre-save hook to auto-generate the serial number
billSchema.pre('save', async function (next) {
    const bill = this;
    
    // Find the counter document for bills
    const counter = await Counter.findOneAndUpdate(
        { id: 'billSerialNumber' },   // ID for the bill serial counter
        { $inc: { seq: 1 } },         // Increment the counter by 1
        { new: true, upsert: true }   // Create document if not exists
    );

    // Set the billSerialNumber to the incremented sequence number
    bill.billSerialNumber = counter.seq;

    next();
});

module.exports = mongoose.model('Bill', billSchema);
