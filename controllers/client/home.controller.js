const Product = require("../../model/product.model");

const productHelpers = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
    // Lay san pham noi bat
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);


    const newProductsFeatured = productHelpers.priceNewProducts(productFeatured);
    // End

    // // Lay san pham moi nhat
    const productNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6);

    const newProductsNew = productHelpers.priceNewProducts(productNew);
    //   // End

    res.render("client/pages/home/index.pug",{
        pageTitle: "Trang chủ",
        productFeatured: newProductsFeatured,
        productNew: newProductsNew
    });
}