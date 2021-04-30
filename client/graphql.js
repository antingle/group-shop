import { gql } from "@apollo/client";

export const join_list = gql`
  mutation join_list($code: String!, $userID: ID!) {
    join_list(code: $code, userID: $userID) {
      id
      list_name
      code
      members
    }
  }
`;

export const get_list = gql`
  query get_list($listID: ID!) {
    get_list(listID: $listID) {
      id
      owner
      list_name
      code
      members
      items {
        id
        name
        member
        purchased
      }
    }
  }
`;
