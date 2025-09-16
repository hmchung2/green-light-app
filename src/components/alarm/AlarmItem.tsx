import {styled} from 'styled-components/native';
import {Alarm} from '../../generated/graphql';
import AlarmItemImg from './AlarmItemImg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types';
import React from 'react';

const AlarmContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 8px 10px;
  align-items: center; /* <-- 아이콘 + 텍스트 모두 중앙 정렬 */
`;

const AlarmImgContainer = styled.View`
  padding-right: 10px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Title = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Detail = styled.View`
  margin-top: 2px;
`;

const MsgText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
`;

const DetailText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
`;

const IconContainer = styled.View<{size: number}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: ${({size}) => size / 2}px;
  margin: 10px 10px 1px 10px;
  justify-content: center;
  align-items: center;
`;

const AlarmNavigationMap = {
  0: 'DefaultAlarmScreen',
  1: 'GreenLightScreen',
  2: 'ToBeContinued',
};

type AlarmItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function AlarmItem(alarm: Alarm) {
  const navigation = useNavigation<AlarmItemNavigationProps>();

  const renderModal = () => {
    switch (alarm.alarmType) {
      case 1:
        navigation.navigate('GreenLightAlarm', {alarm});
        break;
      default:
        break;
    }
  };

  return (
    <AlarmContainer onPress={renderModal}>
      <AlarmImgContainer>
        <AlarmItemImg
          alarmType={alarm.alarmType}
          alarmImgUrl={alarm.alarmImg}
          size={50}
          glow={alarm.alarmType === 1 && !alarm.read}
        />
      </AlarmImgContainer>
      <TextContainer>
        <Title>
          <MsgText>{alarm.msg}</MsgText>
        </Title>
        <Detail>
          <DetailText>{alarm.detail}</DetailText>
        </Detail>
      </TextContainer>
    </AlarmContainer>
  );
}

// const FEED_QUERY = gql`
//   query seeFeed($offset: Int!) {
//     seeFeed(offset: $offset) {
//       ...PhotoFragment
//       user {
//         id
//         username
//         avatar
//       }
//       caption
//       comments {
//         ...CommentFragment
//       }
//       createdAt
//       isMine
//     }
//   }
//   ${PHOTO_FRAGMENT}
//   ${COMMENT_FRAGMENT}
// `;
