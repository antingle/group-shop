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
    list_name: String!
    code: String!
    members: [String!]!
    items: [Item!]!
    created: String!
  }
  type Item {
    name: String!
    member: String
    purchased: Boolean!
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
    get_user(id: ID!): User!
  }
  type Mutation {
    # User Functionality
    register(info: registration_info): User!
    login(email: String!, password: String!): User!
    create_temp_user(screen_name: String!): User!
    delete_user(id: ID!): String!

    #List Functionality
    create_list(list_name: String!, id: ID!): List!
    join_list(code: String!, id: ID!): List!
    leave_list(listID: ID!, userID: ID!): String!
    delete_list(id: ID!): String!
  }
`;
