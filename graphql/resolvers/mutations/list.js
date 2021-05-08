const { UserInputError } = require("apollo-server-errors");

const List = require("../../../models/list");
const { list_validation } = require("../../../util/validation");
const generate_code = require("../../../util/code_generator");

module.exports = {
  create_list: async (_, { list_name, userID }) => {
    // validation
    const { valid, errors, user } = await list_validation({
      list_name,
      userID,
    });
    if (!valid) throw new UserInputError("List Creation Error", { errors });

    // generated a unique 5 character code
    do {
      var code = generate_code();
      var invalid = await List.findOne({ code });
    } while (invalid);

    // creates a new list and saves it to the database
    const list = await new List({
      owner: user._id,
      list_name,
      code,
      members: [
        {
          _id: user._id,
          screen_name: user.screen_name,
        },
      ],
      items: [],
      created: new Date().toISOString(),
    }).save();

    return {
      id: list._id,
      ...list._doc,
    };
  },
  join_list: async (_, { code, userID }, { pubsub }) => {
    // validation
    const { errors, valid, list, user } = await list_validation({
      code,
      userID,
      method: "user-join",
    });
    if (!valid) throw new UserInputError("List Join Error", { errors });

    // adds the user to the list of members adn overwrites the list in the database
    list.members.push({
      _id: user._id,
      screen_name: user.screen_name,
    });
    const updated_list = await list.save();

    // sends an update to everyone in the list containing the user that just joined
    pubsub.publish(updated_list.code, {
      member_updates: {
        type: "join",
        affector: user.screen_name,
        member: {
          id: updated_list.members[list.members.length - 1]._id,
          ...updated_list.members[list.members.length - 1]._doc,
        },
      },
    });

    return {
      id: updated_list._id,
      ...updated_list._doc,
    };
  },
  leave_list: async (_, { listID, userID }, { pubsub }) => {
    // validation
    const { valid, errors, list, user, user_index } = await list_validation({
      listID,
      userID,
      method: "user-leave",
    });
    if (!valid) throw new UserInputError("Leave Error", { errors });

    // removes the user at the specified index
    list.members.splice(user_index, 1);

    // if there are no more users in the list, deletes the list
    if (list.members.length == 0) {
      const deleted = await List.findByIdAndDelete(listID);
      return {
        id: deleted._id,
        ...deleted._doc,
      };
    }

    // if the owner left, updates the owner
    if (user._id == list.owner) list.owner = list.members[0]._id;

    // overwrites the list in the database
    const updated_list = await list.save();

    // sends an update to everyone in the list containing the user that left
    pubsub.publish(updated_list.code, {
      member_updates: {
        type: "leave",
        affector: user.screen_name,
        member: {
          id: user._id,
          ...user._doc,
        },
      },
    });

    // if the owner changed, sends an update to everyone in the list containing the new owner
    if (list.owner != user._id) {
      pubsub.publish(updated_list.code, {
        member_updates: {
          type: "owner change",
          affector: updated_list.members[0].screen_name,
          member: {
            id: updated_list.members[0]._id,
            ...updated_list.members[0]._doc,
          },
        },
      });
    }

    return {
      id: updated_list._id,
      ...updated_list._doc,
    };
  },
  delete_list: async (_, { listID }) => {
    try {
      const deleted_list = await List.findByIdAndDelete(listID);
      return {
        id: deleted_list._id,
        ...deleted_list._doc,
      };
    } catch (err) {
      throw new Error("List Deletion Error", err);
    }
  },
};
