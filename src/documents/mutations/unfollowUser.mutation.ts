import gql from 'graphql-tag';

gql`
  mutation UnfollowUser($followUserId: Int!) {
    unfollowUser(id: $followUserId) {
      ok
      id
      error
    }
  }
`;
