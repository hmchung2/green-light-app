declare module '*.png' {
  const content: number; // This is the correct type for React Native image imports
  export default content;
}
