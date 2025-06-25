import {gql, useQuery, useReactiveVar} from '@apollo/client';
import {useEffect} from 'react';
import {isLoggedInVar, logUserOut} from '../apollo';

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      followingCount
      followersCount
      avatar
    }
  }
`;

interface MeData {
  me: {
    id: number;
    username: string;
    followingCount: number;
    followersCount: number;
    avatar: string | null;
  };
}

export default function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const {data} = useQuery<MeData>(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut().catch(error => console.log('error : ' + error));
    }
  }, [data]);
  return {data};
}
