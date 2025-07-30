import React, {useEffect} from 'react';
import {gql, useApolloClient, useQuery, useSubscription} from '@apollo/client';
import {FlatList} from 'react-native';
import RoomItem from '../components/rooms/RoomItem';
import ScreenLayout from '../components/ScreenLayout';
import {MATCH_FRAGMENT, ROOM_FRAGMENT} from '../fragments';
import styled from 'styled-components/native';
import HList from '../components/users/HList';
import {Room} from '../generated/graphql';
import {CHAT_LIST_UPDATES} from '../documents/subscriptions/chatListUpdates.subscription';
import EmptyList from '../components/flatList/EmptyList';

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

const SEE_MATCHES_QUERY = gql`
  query seeMatches {
    seeMatches {
      ...MatchParts
    }
  }
  ${MATCH_FRAGMENT}
`;

const ListTitle = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 18px;
  margin-top: 20px;
  font-weight: 600;
  margin-left: 30px;
`;

const MarginTopContainer = styled.View`
  margin-top: 20px;
`;

const SeparatorView = styled.View`
  width: 90%;
  height: 1px;
  align-self: center;
  background-color: ${props => props.theme.separatorLineColor};
`;

const BigSeparatorView = styled.View`
  width: 95%;
  height: 3px;
  align-self: center;
  background-color: ${props => props.theme.separatorLineColor};
`;

const EmptyListContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyListText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.fontColor};
  margin-bottom: 15px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 200px;
`;

interface ChatDataProps {
  seeRooms: Room[] | null;
}

export default function Rooms() {
  const client = useApolloClient();

  const {data: chatData, loading: chatLoading} = useQuery<ChatDataProps>(
    SEE_ROOMS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const {data: matchData, loading: matchLoading} = useQuery(SEE_MATCHES_QUERY, {
    fetchPolicy: 'network-only',
  });

  const renderItem = ({item: room}: any) => {
    console.log('r!!!!! ', room);
    return <RoomItem {...room} />;
  };

  const {data: chatListUpdateData} = useSubscription(CHAT_LIST_UPDATES);

  useEffect(() => {
    if (chatListUpdateData?.chatListUpdates) {
      const {roomId, lastMessage} = chatListUpdateData.chatListUpdates;

      console.log('🔄 Updating cache for Room ID:', roomId);
      console.log('📝 New Last Message:', lastMessage);

      client.cache.modify({
        id: `Room:${roomId}`,
        fields: {
          lastMessage(existingLastMessage = null) {
            return lastMessage
              ? {...existingLastMessage, ...lastMessage} // ✅ Preserve existing fields if update is partial
              : existingLastMessage; // ✅ Keep previous value if no new lastMessage
          },
          unreadTotal(existingUnreadTotal = 0) {
            return existingUnreadTotal + 1; // ✅ Increment unread count
          },
        },
      });
    }
  }, [chatListUpdateData, client]);

  return (
    <ScreenLayout loading={matchLoading || chatLoading}>
      <FlatList
        ListHeaderComponent={
          <>
            <MarginTopContainer>
              <ListTitle>Matches</ListTitle>
              {matchLoading ? null : matchData?.seeMatches?.length ? (
                <>
                  <HList title={'Matches'} data={matchData.seeMatches} />
                  <BigSeparatorView />
                </>
              ) : (
                <EmptyList
                  title="No new matches"
                  subtitle="Please, go find matches"
                />
              )}
            </MarginTopContainer>
            <ListTitle>Chats</ListTitle>
          </>
        }
        ItemSeparatorComponent={SeparatorView}
        style={{width: '100%'}}
        data={chatData?.seeRooms}
        keyExtractor={room => '' + room.id}
        renderItem={renderItem}
        ListFooterComponent={
          chatData?.seeRooms?.length !== 0 ? <SeparatorView /> : null
        }
        ListEmptyComponent={
          !chatLoading ? (
            <EmptyList
              title="No chat rooms yet"
              subtitle="Start a conversation with your matches"
            />
          ) : null
        }
      />
    </ScreenLayout>
  );
}
