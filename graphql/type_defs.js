const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    email: String
    password: String
    screen_name: String!
    lists: [String!]
    join_date: String
  }

  input registration_info {
    email: String!
    password: String!
    confirm_password: String!
    screen_name: String!
  }

  type Query {
    get_user(id: ID!): User!
  }
  type Mutation {
    register(info: registration_info): User
  }
`;
