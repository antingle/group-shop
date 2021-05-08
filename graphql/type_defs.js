const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    email: String
    password: String
    screen_name: String!
    lists: [Shortened_List!]!
    join_date: String!
  }
  type Shortened_User {
    id: ID!
    screen_name: String!
  }
  type List {
    id: ID!
    owner: ID!
    list_name: String!
    code: String!
    members: [Shortened_User!]!
    items: [Item!]!
    created: String!
  }
  type Shortened_List {
    id: ID!
    list_name: String!
    owned: Boolean!
  }
  type Item {
    id: ID!
    name: String!
    member: String
    purchased: Boolean!
  }

  interface Update {
    type: String!
    affector: String!
  }
  type item_update implements Update {
    type: String!
    affector: String!
    item: Item!
  }
  type member_update implements Update {
    type: String!
    affector: String!
    member: User!
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
    login(email: String!, password: String!): [List!]!
    create_temp_user(screen_name: String!): User!
    delete_user(userID: ID!): User!

    # List Functionality
    create_list(list_name: String!, userID: ID!): List!
    join_list(code: String!, userID: ID!): List!
    leave_list(listID: ID!, userID: ID!): List!
    delete_list(listID: ID!): List!

    # Item Functionality
    add_item(name: String!, listID: ID!, userID: ID!): List!
    remove_item(listID: ID!, itemID: ID!, userID: ID!): List!
    claim_item(listID: ID!, itemID: ID!, userID: ID!, method: String): List!
    purchase_item(listID: ID!, itemID: ID!, userID: ID!, method: String): List!
  }
  type Subscription {
    item_updates(code: String!): item_update!
    member_updates(code: String!): member_update!
  }
`;
