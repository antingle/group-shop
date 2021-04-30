module.exports = {
  get_item_index: (list, itemID) => {
    let index = -1;
    for (let i = 0; i < list.items.length; i++) {
      if (list.items[i]._id == itemID) {
        index = i;
        break;
      }
    }
    return index;
  },
  get_user_index: (list, userID) => {
    let index = -1;
    for (let i = 0; i < list.members.length; i++) {
      if (list.members[i]._id == userID) {
        index = i;
        break;
      }
    }
    return index;
  },
};
