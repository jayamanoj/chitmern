const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product name"],
        trim: true,
        maxLength: [100, "Product name cannot be more than 100 characters"],
        unique: true 
    },
    date: {
        type: Date, 
        default: Date.now 
    },
    status:{
        type:Boolean,
        default: true
    },
    phoneNumber:{
        type:Number,
        required: [true, "Please enter the phone number"],
    },
    Blance:{
        type:Number,
        required: [true, "Please enter the blances"],
    }
}, { timestamps: true });

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
