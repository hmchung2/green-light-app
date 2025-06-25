import {gql} from 'graphql-tag';

gql`
  query SeeSimpleProfile($seeProfileId: Int!) {
    seeProfile(id: $seeProfileId) {
      id
      birthDay
      avatar
      photos {
        id
        file
      }
      isFollower
      isFollowing
      username
      sex
      instaUsername
      description
      isMe
    }
  }
`;
