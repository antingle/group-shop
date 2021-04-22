const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    email: String
    password: String
    screen_name: String!
    lists: [String!]
    join_date: String!
  }
  type List {
    id: String!
    list_name: String!
    code: String!
    members: [String]!
    items: [Item!]
    createdAt: String!
  }
  type Item {
    name: String!
    member: String
    purchased: Boolean!
  }

  type Query {
    get_list(id: ID): List!
    get_user(id: ID!): User!
  }
  type Mutation {
    login(email: String!, password: String!): User!
    register(
      email: String!
      password: String!
      confirm_password: String!
      screen_name: String!
    ): User!

    create_list(list_name: String!, name: String!): List!
    join_list(name: String!, code: String!): List!
    leave_list(name: String!, id: ID!): String!
    delete_list(id: ID!): String!

    add_item(name: String!, id: ID!): List!
    remove_item(name: String!, id: ID!): List!
  }
  type Subscription {
    user_added(code: String!): String!
  }
`;
