const { gql } = require("apollo-server");

module.exports = gql`
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
    amount: Int!
    member: String
    purchased: String!
  }

  type Query {
    get_list(id: ID): List!
  }
  type Mutation {
    create_list(list_name: String!, name: String!): List!
    join_list(name: String!, code: String!): List!
    leave_list(name: String!, id: ID!): String!
    delete_list(id: ID!): String!

    add_item(name: String!, amount: Int!, id: ID!): List!
    remove_item(name: String!, amount: Int!, id: ID!): List!
  }
  type Subscription {
    user_added(code: String!): String!
  }
`;
