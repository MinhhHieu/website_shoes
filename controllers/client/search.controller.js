const Product = require("../../model/product.model");

const productHelper = require("../../helpers/product");

//[GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProduct = [];

    if(keyword){
        const regex = new RegExp(keyword, "i");
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        });
        newProduct = productHelper.priceNewProducts(products);
    }

    res.render("client/pages/search/index.pug", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProduct
    });
};