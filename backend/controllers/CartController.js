const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    const request = {
      product: productId,
      user: userId
    }
    const cart = await Cart.findOne({ product: productId, user: userId });
    if (cart) {
      const quantity = cart.quantity + 1;
      cart.quantity = quantity;
      await cart.save();
    } else {
      await Cart.create(request);
    }
    return res.status(200).send({
      success: true,
      message: "Item added to cart"
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      success: false,
      message: "Server Error",
      data: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const userId = req.user.id;
    const cart = await Cart.findById(cartId)
    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Invalid Cart"
      });
    } else {
      const quantity = cart.quantity;
      if (quantity === 1) {
        await Cart.remove({ _id: cartId });

      } else {
        cart.quantity = quantity - 1;
        cart.save();
      }
    }
    return res.status(200).send({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user.id })
    const ids = carts.map(cart => cart._id);
    await Cart.deleteMany({ _id: ids });
    return res.status(200).send({
      success: true,
      message: "Carts cleared successfully"
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

exports.listCartItems = async (req, res, next) => {

  try {
    const carts = await Cart.find({ user: req.user.id }).populate("product").sort({ updatedAt: "desc" });
    const items = carts.map(cart => {
      const itemPrice = cart.quantity * cart.product.price;
      return {
        id: cart._id,
        product: cart.product,
        quantity: cart.quantity,
        amount: itemPrice
      }
    });
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.amount;
    }, 0)

    return res.status(201).send({
      status: true,
      data: {
        items,
        totalAmount
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}

exports.checkout = async (req, res, next) => {

  try {
    const { cartIds } = req.body;
    const carts = await Cart.find({ _id: cartIds }).populate("product");
    const items = carts.map(cart => {
      const itemPrice = cart.quantity * cart.product.price;
      return {
        product: cart.product.id,
        quantity: cart.quantity,
        price: itemPrice
      }
    });
    const total = items.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
    const request = {
      user: req.user.id,
      total,
      items
    };
    await Order.create(request);
    await Cart.deleteMany({ _id: cartIds });

    return res.status(201).send({
      status: true,
      message: "You have successfully made a payment"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}
