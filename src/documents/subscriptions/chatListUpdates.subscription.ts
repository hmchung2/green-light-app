import gql from 'graphql-tag';

export const CHAT_LIST_UPDATES = gql`
  subscription ChatListUpdates {
    chatListUpdates {
      id
      lastMessage {
        id
        payload
        read
        user {
          id
          username
          avatar
        }
      }
      roomId
    }
  }
`;
