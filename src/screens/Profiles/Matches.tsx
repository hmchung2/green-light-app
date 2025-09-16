import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {styled} from 'styled-components/native';
import ScreenLayout from '../../components/ScreenLayout';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types';
import {gql, useQuery} from '@apollo/client';
import {MATCH_FRAGMENT} from '../../fragments';
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

const UserInfo = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 10px;
  flex-shrink: 1;
`;

const Username = styled.Text`
  color: ${({theme}) => theme.fontColor};
  font-weight: 600;
  font-size: 16px;
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

type MatchesProps = NativeStackScreenProps<RootStackParamList, 'Matches'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SEE_MATCHES_QUERY = gql`
  query seeMatches {
    seeMatches {
      ...MatchParts
      description
      birthDay
    }
  }
  ${MATCH_FRAGMENT}
`;

export default function Matches(_: MatchesProps) {
  const nav = useNavigation<NavigationProps>();
  const {data, loading} = useQuery(SEE_MATCHES_QUERY, {
    fetchPolicy: 'network-only',
  });

  const currentUsers: User[] = data?.seeMatches ?? [];

  const goToProfile = (id: number) => {
    nav.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {id},
    });
  };

  const renderItem = ({item}: {item: User}) => {
    const age = item.birthDay ? calculateAge(item.birthDay) : null;

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

  return (
    <ScreenLayout loading={loading}>
      <ContentContainer>
        {currentUsers.length === 0 ? (
          <EmptyList
            title="No matches yet"
            subtitle="Please, go find matches"
          />
        ) : (
          <FlatList
            data={currentUsers}
            renderItem={renderItem}
            keyExtractor={item => '' + item.id}
            ItemSeparatorComponent={SeparatorView}
            style={{alignSelf: 'stretch', width: '100%'}}
            contentContainerStyle={{alignItems: 'flex-start'}}
          />
        )}
      </ContentContainer>
    </ScreenLayout>
  );
}
