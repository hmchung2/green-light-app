import styled from 'styled-components/native';
import {Alarm} from '../../generated/graphql.ts';
import AlarmItemImg from './AlarmItemImg.tsx';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types.ts';
import React from 'react';

interface AlarmItemProps {
  id: number;
  msg: string;
  detail: string;
  alarmImg: string;
}

const AlarmContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 8px 10px;
  align-items: center;
`;

const AlarmImgContainer = styled.View`
  padding-right: 10px;
`;

const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Title = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Detail = styled.View`
  padding-top: 5px;
`;

const MsgText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 600;
  font-size: 16px;
`;

const DetailText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 300;
  font-size: 12px;
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
    console.log('need to write code for rendering modal');
    switch (alarm.alarmType) {
      case 1:
        console.log('ok1');
        navigation.navigate('GreenLightAlarm', {alarm});
        break;
      default:
        console.log('ok2');
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
          glow={!alarm.read}
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
