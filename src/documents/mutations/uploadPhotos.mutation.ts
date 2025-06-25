import gql from 'graphql-tag';

gql`
  mutation uploadPhotos($ufiles: [Upload]!) {
    uploadPhotos(ufiles: $ufiles) {
      ok
      error
    }
  }
`;
