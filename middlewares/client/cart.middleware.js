const Cart = require("../../model/cart.model");

module.exports.cartId = async (req, res, next) => {
//   console.log(req.cookies.cartId);

  if (!req.cookies.cartId) {
    // Tao gio hang neu chua co
    const cart = new Cart();
    await cart.save();

    const expiresCookie = 365 * 24 * 60 * 60 * 1000;

    res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresCookie)
    });
  } else {
    // Lay ra thong tin gio hang
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    res.locals.miniCart = cart;
  }

  next();
};
