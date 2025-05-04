const createTree = (arr, parentId = "", countRef) => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = item;
      newItem.index = countRef.count++;
      const children = createTree(arr, item.id, countRef);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

module.exports.tree = (arr, parentId = "") => {
  const countRef = { count: 1 }; // sử dụng object để truyền tham chiếu
  return createTree(arr, parentId, countRef);
};
