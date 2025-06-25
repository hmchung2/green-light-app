import gql from 'graphql-tag';

gql`
  mutation EditProfile(
    $username: String
    $description: String
    $gender: String
    $birthDay: String
    $avatar: Upload
    $photos: [PhotoInput]!
  ) {
    editProfile(
      username: $username
      description: $description
      gender: $gender
      birthDay: $birthDay
      avatar: $avatar
      photos: $photos
    ) {
      ok
      error
    }
  }
`;
