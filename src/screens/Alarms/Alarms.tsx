import React, {useRef, useEffect, useState} from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import {FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useNotifications} from '../../hooks/NotificiationContext';
import {useSeeAlarmsMutation} from '../../generated/graphql';
import AlarmItem from '../../components/alarm/AlarmItem';
import {SeparatorView} from '../../components/flatList/SeparatorView';
import {gql, useQuery} from '@apollo/client';
import EmptyList from '../../components/flatList/EmptyList';

const SEE_ALARMS_MY_QUERY = gql`
  query ReadAlarms($offset: Int!) {
    readAlarms(offset: $offset) {
      id
      endPage
      result {
        id
        msg
        detail
        read
        seen
        alarmType
        targetId
        alarmImg
        updatedAt
        createdAt
      }
    }
  }
`;

export default function Alarms() {
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {hasUnSeenAlarms, setHasUnSeenAlarms} = useNotifications();
  const {
    data: alarmData,
    loading: alarmLoading,
    refetch,
    fetchMore,
  } = useQuery(SEE_ALARMS_MY_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const [seeAlarms] = useSeeAlarmsMutation();

  useEffect(() => {
    if (isFocused && hasUnSeenAlarms) {
      seeAlarms()
        .then(r => console.log(r))
        .catch(error => console.log(error));
      setHasUnSeenAlarms(false);
    }
  }, [isFocused]);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({item: alarm}: any) => <AlarmItem {...alarm} />;

  const onEndReached = async () => {
    // Check if we already have reached the end of the pages
    if (
      alarmData?.readAlarms?.result?.length &&
      !alarmData.readAlarms.endPage
    ) {
      console.log(
        'Fetching more alarms, current offset: ',
        alarmData.readAlarms.result.length,
      );
      setRefreshing(true);

      await fetchMore({
        variables: {
          offset: alarmData.readAlarms.result.length,
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          // Combine the old and new alarm results
          const combinedResult = [
            ...previousResult.readAlarms.result,
            ...fetchMoreResult.readAlarms.result,
          ];
          return {
            ...previousResult,
            readAlarms: {
              ...previousResult.readAlarms,
              result: combinedResult,
              // Update endPage based on the fetched result
              endPage: fetchMoreResult.readAlarms.endPage,
            },
          };
        },
      });
      setRefreshing(false);
    } else {
      console.log('End of data reached or already fetching.');
    }
  };

  return (
    <ScreenLayout loading={alarmLoading}>
      <FlatList
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
        style={{width: '100%'}}
        data={alarmData?.readAlarms?.result}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ItemSeparatorComponent={() => <SeparatorView width={'100%'} />}
        keyExtractor={alarm => '' + alarm.id}
        ListEmptyComponent={
          !alarmLoading ? (
            <EmptyList
              title="No notifications yet"
              subtitle="Your notifications will appear here once they arrive"
            />
          ) : null
        }
      />
    </ScreenLayout>
  );
}
