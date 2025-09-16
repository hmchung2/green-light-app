declare module 'apollo-upload-client/createUploadLink.mjs' {
  import {ApolloLink} from '@apollo/client';

  export interface UploadLinkOptions {
    uri?: string;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    fetchOptions?: Record<string, any>;

    /**
     * 커스텀 파일 판별 함수
     * 기본적으로는 File/Blob/ReactNativeFile만 true.
     * RN에서는 { uri, name, type } 객체도 파일로 인식시키려면 이걸 추가해야 함.
     */
    isExtractableFile?: (value: any) => boolean;
  }

  export default function createUploadLink(
    options?: UploadLinkOptions,
  ): ApolloLink;
}
