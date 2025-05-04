const User = require("../../model/user.model");

// [GET]: /admin/users
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await User.find(find).select("-password -tokenUser");

    res.render("admin/pages/users/index.pug", {
      pageTitle: "Danh sách người dùng",
      records: records
    });
  };