import {gql} from 'graphql-tag';

gql`
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
