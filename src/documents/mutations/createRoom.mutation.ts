import gql from 'graphql-tag';

gql`
  mutation CreateRoom($targetId: Int!) {
    createRoom(targetId: $targetId) {
      error
      id
      ok
    }
  }
`;
