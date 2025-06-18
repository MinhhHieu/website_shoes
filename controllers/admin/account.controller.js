const md5 = require("md5");
const Account = require("../../model/account.model");
const Role = require("../../model/role.model");

const systemConfig = require("../../config/system");

// [GET]: /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET]: /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST]: /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExits) {
    req.flash("error", "Email này đã tồn tại!");
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);

    const records = new Account(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET]: /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Danh sách tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH]: /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExits = await Account.findOne({
    _id: {$ne: id},
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email này đã tồn tại!");
  } else{
    if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
    
      await Account.updateOne({ _id: id }, req.body);
    
      req.flash("success", "Cập nhật tài khoản thành công!");
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

    const account = await Account.findOne(find);

    res.render("admin/pages/accounts/detail.pug", {
      pageTitle: account.title,
      account: account,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};


