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
      members {
        id
        screen_name
      }
      items {
        id
        name
        member
        purchased
      }
    }
  }
`;

export const add_item = gql`
  mutation add_item($name: String!, $listID: ID!, $userID: ID!) {
    add_item(name: $name, listID: $listID, userID: $userID) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      items {
        id
        name
        member
        purchased
      }
      created
    }
  }
`;

export const purchase_item = gql`
  mutation purchase_item(
    $listID: ID!
    $itemID: ID!
    $userID: ID!
    $method: String!
  ) {
    purchase_item(
      listID: $listID
      itemID: $itemID
      userID: $userID
      method: $method
    ) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      items {
        id
        name
        member
        purchased
      }
      created
    }
  }
`;

export const remove_item = gql`
  mutation remove_item($listID: ID!, $itemID: ID!, $userID: ID!) {
    remove_item(listID: $listID, itemID: $itemID, userID: $userID) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      items {
        id
        name
        member
        purchased
      }
      created
    }
  }
`;
