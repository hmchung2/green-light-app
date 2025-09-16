// types/extract-files.d.ts
declare module 'extract-files' {
  export class ReactNativeFile {
    constructor(params: {uri: string; name?: string; type?: string});
    uri: string;
    name: string;
    type: string;
  }

  export function extractFiles(
    value: any,
    path?: string,
    isExtractableFile?: (value: any) => boolean,
  ): {clone: any; files: Map<any, any>};

  export function isExtractableFile(value: any): boolean;
}
