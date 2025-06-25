import gql from 'graphql-tag';

gql`
  mutation ReadAlarm($readAlarmId: Int!) {
    readAlarm(id: $readAlarmId) {
      ok
      error
    }
  }
`;
