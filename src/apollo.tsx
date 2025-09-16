import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  makeVar,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from 'graphql-ws';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';
import {FragmentDefinitionNode, OperationDefinitionNode} from 'graphql';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string | null>(null);
export const colorModeVar = makeVar<'light' | 'dark'>('dark');

const TOKEN: string = 'token';

export const logUserIn = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
  try {
    await client.clearStore();
  } catch (e) {
    console.error('Error clearing Apollo cache on login', e);
  }
};

export const logUserOut = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar('');
  try {
    await client.clearStore();
  } catch (e) {
    console.error('Error clearing Apollo cache on logout', e);
  }
};

const uploadHttpLink: ApolloLink = createUploadLink({
  uri: 'https://e609d5c4992a.ngrok-free.app/graphql',
  isExtractableFile: (v: any) =>
    !!v &&
    typeof v === 'object' &&
    typeof v.uri === 'string' &&
    typeof v.name === 'string' &&
    typeof v.type === 'string',
});

// ✅ WebSocket link (wss recommended)
const wsLink: GraphQLWsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://e609d5c4992a.ngrok-free.app/graphql',
    connectionParams: () => ({token: tokenVar()}),
  }),
);

// ✅ Auth link (do not override Content-Type!)
const authLink: ApolloLink = setContext((_, {headers}) => ({
  headers: {
    ...headers,
    token: tokenVar(),
  },
}));

// ✅ Error logging
const onErrorLink: ApolloLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    console.log('GraphQL Error', graphQLErrors);
  }
  if (networkError) {
    console.log('Network Error', networkError);
  }
});

// ✅ http link chain
const httpLinks: ApolloLink = authLink
  .concat(onErrorLink)
  .concat(uploadHttpLink);

// ✅ split queries vs subscriptions
const splitLink: ApolloLink = split(
  ({query}) => {
    const definition: OperationDefinitionNode | FragmentDefinitionNode =
      getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLinks,
);

// ✅ Cache setup
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {},
    },
    User: {
      keyFields: ['id'],
    },
    Location: {
      keyFields: ['userId'],
    },
  },
});

// ✅ Apollo Client
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
