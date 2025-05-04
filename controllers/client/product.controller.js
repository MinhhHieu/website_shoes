const Product = require("../../model/product.model");
const ProductCategory = require("../../model/product-category.model");

const productHelpers = require("../../helpers/product");

// [GET]: /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({position: "desc"});

  const newProducts = productHelpers.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET]: /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active"
    };

    const product = await Product.findOne(find);

    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false
      });

      product.category = category;
    }

    product.priceNew = (
      (product.price * (100 - product.discountPercentage))/100
    ).toFixed(0);

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect("/products");
  }
}

// [GET]: /products/:slugCategory
module.exports.category = async (req, res) => {

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active"
  });
  
  // // Lay ra danh muc con
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });

    let allSub = [...subs];

    for(const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  };
  const listSubCategory = await getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);
  
  const products = await Product.find({
    product_category_id: {$in: [category.id, ...listSubCategoryId]},
    deleted: false
  }).sort({position: "desc"});

  const newProducts = products.map((item) => {
    item.priceNew = ((item.price * (100 - item.discountPercentage)) /100).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts,
  });
};




