const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',
    required:true
  },
  items: [
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      }
    },
  ],
  total:{
    type:Number,
    required:true
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "delivered", "rejected"],
    default: "pending"
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);
