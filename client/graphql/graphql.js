import { gql } from "@apollo/client";

//======= GENERAL ACTIONS =======//
export const REGISTER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      info: {
        screen_name: $name
        email: $email
        password: $password
        confirm_password: $confirmPassword
      }
    ) {
      token
      user {
        id
        email
        screen_name
        join_date
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        screen_name
        join_date
      }
    }
  }
`;

export const CREATE_TEMP_USER = gql`
  mutation create_temp_user($screen_name: String!) {
    create_temp_user(screen_name: $screen_name) {
      token
      user {
        id
        email
        screen_name
        join_date
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation delete_user {
    delete_user {
      id
    }
  }
`;

export const GET_USER = gql`
  query get_user($userID: ID!) {
    get_user(userID: $userID) {
      id
      email
      password
      screen_name
      lists {
        id
        list_name
        owned
        members {
          id
          screen_name
        }
        last_modified
      }
      join_date
    }
  }
`;

export const GET_USER_LISTS = gql`
  query get_user_lists($userID: ID!) {
    get_user_lists(userID: $userID) {
      id
      list_name
      owned
      members {
        id
        screen_name
      }
      last_modified
    }
  }
`;

//======= LIST ACTIONS =======//
export const GET_LIST = gql`
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
        last_modified
      }
      created
      last_modified
    }
  }
`;

export const JOIN_LIST = gql`
  mutation join_list($code: String!) {
    join_list(code: $code) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      created
      last_modified
    }
  }
`;

export const CREATE_LIST = gql`
  mutation create_list($listName: String!) {
    create_list(list_name: $listName) {
      id
      owner
      list_name
      code
      members {
        id
        screen_name
      }
      created
      last_modified
    }
  }
`;

export const DELETE_LIST = gql`
  mutation delete_list($listID: ID!) {
    delete_list(listID: $listID) {
      id
    }
  }
`;

export const LEAVE_LIST = gql`
  mutation leave_list($listID: ID!) {
    leave_list(listID: $listID) {
      id
    }
  }
`;

//======= ITEM ACTIONS =======//
export const ADD_ITEM = gql`
  mutation add_item($name: String!, $listID: ID!) {
    add_item(name: $name, listID: $listID) {
      id
      name
      member
      purchased
      last_modified
    }
  }
`;

export const PURCHASE_ITEM = gql`
  mutation purchase_item($listID: ID!, $itemID: ID!, $method: String!) {
    purchase_item(listID: $listID, itemID: $itemID, method: $method) {
      id
      name
      member
      purchased
      last_modified
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation remove_item($listID: ID!, $itemID: ID!) {
    remove_item(listID: $listID, itemID: $itemID) {
      id
      name
      member
      purchased
      last_modified
    }
  }
`;

export const CLAIM_ITEM = gql`
  mutation claim_item($listID: ID!, $itemID: ID!, $method: String!) {
    claim_item(listID: $listID, itemID: $itemID, method: $method) {
      id
      name
      member
      purchased
      last_modified
    }
  }
`;

export const ITEM_UPDATES = gql`
  subscription item_updates($listID: ID!) {
    item_updates(listID: $listID) {
      type
      affector {
        id
        screen_name
      }
      item {
        id
        name
        member
        purchased
        last_modified
      }
    }
  }
`;
