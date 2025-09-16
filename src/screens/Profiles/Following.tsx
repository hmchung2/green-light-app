import React, {useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components/native';
import ScreenLayout from '../../components/ScreenLayout';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types';
import {gql, useQuery} from '@apollo/client';
import AvatarImg from '../../components/users/AvatarImg';
import {SeparatorView} from '../../components/flatList/SeparatorView';
import {useNavigation} from '@react-navigation/native';
import {User} from '../../generated/graphql';
import EmptyList from '../../components/flatList/EmptyList';
import {calculateAge} from '@/src/hooks/Utils';

const Column = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
`;

const Username = styled.Text`
  color: ${({theme}) => theme.fontColor};
  font-weight: 600;
  font-size: 16px;
`;

const UserInfo = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 10px;
  flex-shrink: 1;
`;
const UserSubInfo = styled.Text`
  color: ${({theme}) => theme.fontColor};
  font-size: 14px;
  margin-top: 2px;
`;

const ContentContainer = styled.View`
  flex: 1;
  width: 100%;
  align-self: stretch;
  align-items: flex-start;
`;

type FollowingProps = NativeStackScreenProps<RootStackParamList, 'Following'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SEE_FOLLOWING_QUERY = gql`
  query seeFollowing($page: Int!) {
    seeFollowing(page: $page) {
      ok
      following {
        id
        username
        avatar
        birthDay
        description
      }
      totalPages
    }
  }
`;

export default function Following(_: FollowingProps) {
  const nav = useNavigation<NavigationProps>();
  const [page, setPage] = useState(1);

  const {data, loading, fetchMore} = useQuery(SEE_FOLLOWING_QUERY, {
    variables: {page: 1},
    fetchPolicy: 'network-only',
  });

  const followingUsers: User[] = data?.seeFollowing?.following ?? [];

  const goToProfile = (id: number) => {
    nav.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {id},
    });
  };

  const renderItem = ({item}: {item: User}) => {
    const age = item.birthDay ? calculateAge(item.birthDay) : null;
    console.log('age : ', age);
    return (
      <TouchableOpacity onPress={() => goToProfile(item.id)}>
        <Column>
          <AvatarImg avatarPath={item.avatar ?? undefined} size={70} />
          <UserInfo>
            <Username>{item.username}</Username>
            {item.description ? (
              <UserSubInfo>{item.description}</UserSubInfo>
            ) : null}
            {age !== null ? <UserSubInfo>{`Age: ${age}`}</UserSubInfo> : null}
          </UserInfo>
        </Column>
      </TouchableOpacity>
    );
  };

  const loadMore = () => {
    if (page < data?.seeFollowing?.totalPages) {
      const nextPage = page + 1;
      fetchMore({
        variables: {page: nextPage},
        updateQuery: (prev, {fetchMoreResult}) => {
          if (!fetchMoreResult) return prev;
          return {
            seeFollowing: {
              ...fetchMoreResult.seeFollowing,
              following: [
                ...prev.seeFollowing.following,
                ...fetchMoreResult.seeFollowing.following,
              ],
            },
          };
        },
      });
      setPage(nextPage);
    }
  };

  return (
    <ScreenLayout loading={loading}>
      <ContentContainer>
        {followingUsers.length === 0 ? (
          <EmptyList title="No following yet" subtitle="Go follow someone!" />
        ) : (
          <FlatList
            data={followingUsers}
            renderItem={renderItem}
            keyExtractor={item => '' + item.id}
            ItemSeparatorComponent={SeparatorView}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            style={{alignSelf: 'stretch', width: '100%'}}
            contentContainerStyle={{alignItems: 'flex-start'}}
          />
        )}
      </ContentContainer>
    </ScreenLayout>
  );
}
