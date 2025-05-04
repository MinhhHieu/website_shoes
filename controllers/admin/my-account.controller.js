const md5 = require("md5");
const Account = require("../../model/account.model");

// [GET]: /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin cá nhân"
    });
}

// [GET]: /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin cá nhân "
    });
}

// [PATCH]: /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

    if (req.file) {
        req.body.avatar = `/uploads/${req.file.filename}`;
      }

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
}