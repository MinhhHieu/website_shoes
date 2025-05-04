const ProductCategory = require("../../model/product-category.model");
const Product = require("../../model/product.model");
const Account = require("../../model/account.model");
const User = require("../../model/user.model");
const Order = require("../../model/order.model");

// [GET]: /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categeryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        order: {
            total:0
        }
    };
    
    // ProductCategory
    statistic.categeryProduct.total = await ProductCategory.countDocuments({
        deleted: false
    });

    statistic.categeryProduct.active = await ProductCategory.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.categeryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
        deleted: false
    });

    // Product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });

    statistic.product.active = await Product.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.product.inactive = await Product.countDocuments({
        status: "inactive",
        deleted: false
    });

    // ACCOUNT ADMIN
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });

    statistic.account.active = await Account.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.account.inactive = await Account.countDocuments({
        status: "inactive",
        deleted: false
    });

    // USER
    statistic.user.total = await User.countDocuments({
        deleted: false
    });

    statistic.user.active = await User.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.user.inactive = await User.countDocuments({
        status: "inactive",
        deleted: false
    });

       // ORDER
    statistic.order.total = await Order.countDocuments({
        deleted: false
    });

    res.render("admin/pages/dashboard/index.pug",{
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
}




