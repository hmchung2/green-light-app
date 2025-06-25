import gql from 'graphql-tag';

gql`
  mutation sendVerification($email: String!, $forSignup: Boolean!) {
    sendVerification(email: $email, forSignup: $forSignup) {
      ok
      error
    }
  }
`;
