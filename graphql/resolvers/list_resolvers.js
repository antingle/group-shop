const { UserInputError } = require("apollo-server-errors");

const List = require("../../models/list");
const { list_validation } = require("../../util/validation");

module.exports = {
  Query: {
    get_list: async (_, { listID }) => {
      try {
        const list = await List.findById(listID);
        return {
          id: list._id,
          ...list._doc,
        };
      } catch (err) {
        throw new Error("List Retrieval Error", err);
      }
    },
    get_user_lists: async (_, { userID }) => {
      try {
        const lists = await List.find({ owner: userID });
        return lists;
      } catch (err) {
        throw new Error("List Retrieval Error", err);
      }
    },
  },
  Mutation: {
    create_list: async (_, { list_name, userID }) => {
      // input validation
      const { valid, errors, user } = await list_validation({
        list_name,
        userID,
      });
      if (!valid) throw new UserInputError("List Creation Error", { errors });

      // generate a 5-digit join code
      do {
        var code = Math.floor(Math.random() * (100000 - 10000)) + 10000;
        var invalid = await List.findOne({ code: code.toString() });
      } while (invalid);

      // creates a new list and saves it to the database
      const list = await new List({
        owner: user._id,
        list_name,
        code: code.toString(),
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
      // input validation
      const { errors, valid, list, user } = await list_validation({
        code,
        userID,
        method: "user-join",
      });
      if (!valid) throw new UserInputError("List Join Error", { errors });

      list.members.push({
        _id: user._id,
        screen_name: user.screen_name,
      });
      const updated_list = await list.save();

      pubsub.publish(list.code, {
        update: {
          type: "join",
          affector: user.screen_name,
          list: {
            id: updated_list._id,
            ...updated_list._doc,
          },
        },
      });

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    leave_list: async (_, { listID, userID }, { pubsub }) => {
      const { valid, errors, list, user, user_index } = await list_validation({
        listID,
        userID,
        method: "user-leave",
      });
      if (!valid) throw new UserInputError("Leave Error", { errors });

      list.members.splice(user_index, 1);

      if (list.members.length == 0) {
        const removed = await List.findByIdAndDelete(listID);
        return {
          id: removed._id,
          ...removed._doc,
        };
      }

      pubsub.publish(list.code, {
        update: {
          type: "leave",
          affector: user.screen_name,
          list: {
            id: list._id,
            ...list._doc,
          },
        },
      });

      if (userID == list.owner) {
        list.owner = list.members[0]._id;
        pubsub.publish(list.code, {
          update: {
            type: "owner change",
            affector: list.members[0].screen_name,
            list: {
              id: list._id,
              ...list._doc,
            },
          },
        });
      }
      const updated_list = list.save();

      return {
        id: updated_list._id,
        ...updated_list._doc,
      };
    },
    delete_list: async (_, { listID }) => {
      try {
        const removed = await List.findByIdAndDelete(listID);
        return {
          id: removed._id,
          ...removed._doc,
        };
      } catch (err) {
        throw new Error("List Deletion Error", err);
      }
    },
  },
};
