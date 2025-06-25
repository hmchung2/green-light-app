import {gql} from 'graphql-tag';

gql`
  query DetailMe {
    me {
      id
      userType
      description
      followersCount
      followingCount
      photos {
        id
        file
      }
      username
      birthDay
      avatar
      sex
      userStatus
      instaUsername
    }
  }
`;
