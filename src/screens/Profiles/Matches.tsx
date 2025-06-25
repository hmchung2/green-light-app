import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ScreenLayout from '../../components/ScreenLayout.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types.ts';
import {gql, useQuery} from '@apollo/client';
import {MATCH_FRAGMENT} from '../../fragments.tsx';

const TabButton = styled.TouchableOpacity<{active: boolean}>`
  flex: 1;
  padding: 12px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${({active, theme}) =>
    active ? theme.fontColor : 'transparent'};
`;

const TabText = styled.Text<{active: boolean}>`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${({active, theme}) => (active ? theme.fontColor : '#999')};
`;

const TabRow = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.separatorLineColor};
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const PlaceholderText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.fontColor};
`;

type MatchesAlarmProps = NativeStackScreenProps<RootStackParamList, 'Matches'>;

const SEE_MATCHES_QUERY = gql`
  query seeMatches {
    seeMatches {
      ...MatchParts
    }
  }
  ${MATCH_FRAGMENT}
`;

export default function Matches({
  navigation,
  route: {params: MatchParams},
}: MatchesAlarmProps) {
  //
  useEffect(() => {
    console.log('matches');
  }, []);

  const {loading: matchLoading, refetch} = useQuery(SEE_MATCHES_QUERY, {
    fetchPolicy: 'network-only',
  });

  const [activeTab, setActiveTab] = useState<'matches' | 'following'>(
    'matches',
  );

  return (
    <>
      <TabRow>
        <TabButton
          active={activeTab === 'matches'}
          onPress={() => setActiveTab('matches')}>
          <TabText active={activeTab === 'matches'}>Matches</TabText>
        </TabButton>
        <TabButton
          active={activeTab === 'following'}
          onPress={() => setActiveTab('following')}>
          <TabText active={activeTab === 'following'}>Following</TabText>
        </TabButton>
      </TabRow>
      <ScreenLayout loading={matchLoading}>
        <ContentContainer>
          {activeTab === 'matches' ? (
            <PlaceholderText>Matched users will appear here</PlaceholderText>
          ) : (
            <PlaceholderText>
              Users you're following will appear here
            </PlaceholderText>
          )}
        </ContentContainer>
      </ScreenLayout>
    </>
  );
}
