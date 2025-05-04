const ProductCategory = require("../../model/product-category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET]: /admin/products-category
module.exports.index = async (req, res) => {

  let find = {};

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET]: /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {};

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST]: /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success","Đã thêm thành công!");

  res.redirect("back");
};

// [GET]: /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
  
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
  
    const records = await ProductCategory.find({
      deleted: false
    });
  
    const newRecords = createTreeHelper.tree(records);
  
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Sửa danh mục sản phẩm",
      data: data,
      records: newRecords
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
};

// [PATCH]: /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {

  const id = req.params.id;

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({_id: id}, req.body);

  req.flash("success","Cập nhật thành công!");

  res.redirect("back");
};

// [GET]: /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
  
    const records = await ProductCategory.findOne(find);
    
    res.render("admin/pages/products-category/detail.pug", {
      pageTitle: records.title,
      records: records
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

