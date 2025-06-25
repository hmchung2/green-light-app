import gql from 'graphql-tag';

export const ALARM_UPDATES = gql`
  subscription AlarmUpdates {
    alarmUpdates {
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
`;
