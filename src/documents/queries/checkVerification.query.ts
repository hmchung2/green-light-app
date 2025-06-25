import {gql} from 'graphql-tag';

gql`
  query CheckVerification($email: String!, $code: String!) {
    checkVerification(email: $email, code: $code) {
      ok
      error
    }
  }
`;
