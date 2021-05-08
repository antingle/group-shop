module.exports = {
  get_item_index: (list, itemID) => {
    // goes through the entire item array and tries to find the index of the item ID
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
    // goes through the entire members array and tries to find the index of the user ID
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
