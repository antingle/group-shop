module.exports = (list, itemID) => {
  let index = -1;
  for (let i = 0; i < list.items.length; i++) {
    if (list.items[i]._id == itemID) {
      index = i;
      break;
    }
  }
  return index;
};
