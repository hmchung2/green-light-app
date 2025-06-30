declare module 'apollo-upload-client/createUploadLink.mjs' {
  import {ApolloLink} from '@apollo/client';

  interface UploadLinkOptions {
    uri?: string;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    fetchOptions?: Record<string, any>;
  }

  const createUploadLink: (options?: UploadLinkOptions) => ApolloLink;
  export default createUploadLink;
}
