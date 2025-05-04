const Order = require("../../model/order.model");

// [GET]: /admin/users
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const orders = await Order.find(find).sort({ createdAt: -1 });

    const records = orders.map((order) => {
        const totalQuantity = order.products.reduce(
          (sum, product) => sum + product.quantity,
          0
        );
  
        return {
          ...order.toObject(),
          totalQuantity,
        };
      });

    res.render("admin/pages/order/index.pug", {
      pageTitle: "Danh sách đơn hàng",
      records: records
    });
  };

  // [GET]: /admin/products/detail/:id
module.exports.detail = async (req, res) => {
      const find = {
        deleted: false,
        _id: req.params.id,
      };
  
      const order = await Order.findOne(find);

      res.render("admin/pages/order/detail.pug", {
        pageTitle: order.title,
        order: order
      });
  };