const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    email: String
    password: String
    screen_name: String!
    lists: [String!]!
    join_date: String!
  }
  type List {
    id: ID!
    owner: ID!
    list_name: String!
    code: String!
    members: [Member!]!
    items: [Item!]!
    created: String!
  }
  type Member {
    id: ID!
    screen_name: String!
  }
  type Item {
    id: ID!
    name: String!
    member: String
    purchased: Boolean!
  }
  type item_update {
    type: String!
    affector: String!
    item: Item!
  }

  input registration_info {
    email: String!
    password: String!
    confirm_password: String!
    screen_name: String!
  }

  type Query {
    # User Queries
    get_every_user: [User!]
    get_user(userID: ID!): User

    # List Queries
    get_list(listID: ID!): List
    get_user_lists(userID: ID!): [List!]
  }
  type Mutation {
    # User Functionality
    register(info: registration_info): User!
    login(email: String!, password: String!): User!
    create_temp_user(screen_name: String!): User!
    delete_user(userID: ID!): String!

    # List Functionality
    create_list(list_name: String!, userID: ID!): List!
    join_list(code: String!, userID: ID!): List!
    leave_list(listID: ID!, userID: ID!): String!
    delete_list(listID: ID!): String!

    # Item Functionality
    add_item(name: String!, listID: ID!, userID: ID!): List!
    remove_item(listID: ID!, itemID: ID!, userID: ID!): List!
    claim_item(listID: ID!, itemID: ID!, userID: ID!, method: String): List!
    purchase_item(listID: ID!, itemID: ID!, userID: ID!, method: String): List!
  }
  type Subscription {
    update(code: String!): String!

    item_updates(code: String!): item_update!
  }
`;
