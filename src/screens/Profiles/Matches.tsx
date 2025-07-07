import React, {useEffect} from 'react';
import {FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
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

const Column = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const Username = styled.Text`
  color: ${({theme}) => theme.fontColor};
  font-weight: 600;
  font-size: 16px;
  padding-left: 10px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

type MatchesProps = NativeStackScreenProps<RootStackParamList, 'Matches'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SEE_MATCHES_QUERY = gql`
  query seeMatches {
    seeMatches {
      ...MatchParts
    }
  }
  ${MATCH_FRAGMENT}
`;

export default function Matches({}: MatchesProps) {
  const nav = useNavigation<NavigationProps>();
  const {data, loading} = useQuery(SEE_MATCHES_QUERY, {
    fetchPolicy: 'network-only',
  });

  const goToProfile = (id: number) => {
    nav.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {id},
    });
  };

  const renderItem = ({item}: {item: User}) => (
    <TouchableOpacity onPress={() => goToProfile(item.id)}>
      <Column>
        <AvatarImg avatarPath={item.avatar ?? undefined} size={70} />
        <Username>{item.username}</Username>
      </Column>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout loading={loading}>
      <ContentContainer>
        <FlatList
          data={data?.seeMatches ?? []}
          renderItem={renderItem}
          keyExtractor={item => '' + item.id}
          ItemSeparatorComponent={SeparatorView}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      </ContentContainer>
    </ScreenLayout>
  );
}
