const { gql } = require("apollo-server");

module.exports = gql`
  type List {
    id: String!
    code: String!
    members: [String]!
    items: [Item!]
    createdAt: String!
  }
  type Item {
    name: String!
    member: String
    purchased: String!
  }

  type Query {
    get_list: List!
  }
  type Mutation {
    create_list(name: String): List!
    join_list(name: String, code: String): List!
  }
`;
