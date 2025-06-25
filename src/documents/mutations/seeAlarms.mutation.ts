import gql from 'graphql-tag';

gql`
  mutation SeeAlarms {
    seeAlarms {
      ok
      error
    }
  }
`;
