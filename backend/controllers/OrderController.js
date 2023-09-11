const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

exports.getOrders = async (req, res, next) => {
  try {
    const { role } = req.query;
    let where = { user: req.user.id }
    if (role === "admin") {
      where = {};
    }
    const orders = await Order.find(where).sort({ updatedAt: "desc" });
    const data = await Promise.all(
      orders.map(async order => {
        const user = await User.findOne({ _id: order.user }).select("name email");
        const products = await Promise.all(
          order.items.map(async item => {
            const productItem = await Product.findById(item.product).select("name price productImage");
            return {
              product: productItem,
              quantity: item.quantity,
              price: item.price,
            };
          })
        )
        return {
          id: order._id,
          user,
          items: products,
          total: order.total,
          deliveryStatus: order.deliveryStatus
        }
      })
    )

    return res.status(201).send({
      status: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}

exports.findOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });
    const user = await User.findOne({ _id: order.user }).select("name email");
    const products = await Promise.all(
      order.items.map(async item => {
        const productItem = await Product.findById(item.product).select("name price productImage");
        return {
          product: productItem,
          quantity: item.quantity,
          price: item.price,
        };
      })
    )
    const data = {
      id: order._id,
      user,
      items: products,
      total: order.total,
      deliveryStatus: order.deliveryStatus
    }

    return res.status(201).send({
      status: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}