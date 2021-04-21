const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    test_query: String
  }
  type Mutation {
    test_mutation: String
  }
`;
