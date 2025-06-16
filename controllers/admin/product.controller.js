const Product = require("../../model/product.model");

const ProductCategory = require("../../model/product-category.model");

const Account = require("../../model/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

// [GET]: /admin/products
module.exports.index = async (req, res) => {
  //console.log(req.query.status);

  // Bo loc SP
  const filterStatus = filterStatusHelper(req.query);

  // Object lay data
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 5,
    },
    req.query,
    countProducts
  );
  // End Pagination

  //Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //End Sort

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort(sort);

  for (const product of products) {
    // Lay ra thong tin nguoi tao
    const user = await Account.findOne({
      _id: product.createBy.account_id,
    });

    if (user) {
      product.accountFullname = user.fullName;
    }
  }

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH]: /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  //console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updateAt: new Date()
  }

  await Product.updateOne({ _id: id }, { 
    status: status,
    $push: {updatedBy: updatedBy}
   });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect("back");
};

// [PATCH]: /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updateAt: new Date()
  }

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "active",
        $push: {updatedBy: updatedBy}
       });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "inactive",
        $push: {updatedBy: updatedBy}
      });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          // deletedAt: new Date(),
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xoá thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { 
          position: position,
          $push: {updatedBy: updatedBy}
         });
      }
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
      break;
    default:
      break;
  }

  res.redirect("back");
};

// [DELETE]: /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  //console.log(req.params);
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      // deletedAt: new Date(),
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("success", `Đã xoá thành công sản phẩm!`);

  res.redirect("back");
};

// [GET]: /admin/products/create
module.exports.create = async (req, res) => {
  let find = {};

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm sản phẩm",
    category: newCategory,
  });
};

// [POST]: /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  // logs create product
  req.body.createBy = {
    account_id: res.locals.user.id,
  };

  const product = new Product(req.body);
  await product.save();

  req.flash("success", `Đã thêm sản phẩm thành công!`);

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET]: /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
      deleted: false,
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH]: /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date()
    }
    await Product.updateOne({ _id: id }, {
      ...req.body,
      $push: {updatedBy: updatedBy}
    });

    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }
  res.redirect("back");
};

// [GET]: /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
