import React, {useEffect, useState} from 'react';
import ScreenLayout from '../../components/ScreenLayout.tsx';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types.ts';
import {colors} from '../../colors.ts';
import {useWindowDimensions} from 'react-native';
import AvatarImg from '../../components/users/AvatarImg.tsx';
import {ApolloCache, FetchResult, gql, useApolloClient} from '@apollo/client';
import {Scalars, useReadAlarmMutation} from '../../generated/graphql.ts';
import {Maybe} from 'graphql/jsutils/Maybe';

type greenLightAlarmProps = NativeStackScreenProps<
  RootStackParamList,
  'GreenLightAlarm'
>;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const LeftStyledButton = styled.TouchableOpacity`
  background-color: ${props => colors.green};
  flex: 1;
  padding: 5px 12px;
  height: 38px;
  margin: 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const LeftButtonText = styled.Text`
  font-weight: bold;
  font-size: 19px;
  color: ${props => props.theme.fontWithThemeBackground};
`;

const RightStyledButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.fontColor};
  flex: 1;
  padding: 5px 12px;
  height: 38px;
  margin: 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const RightButtonText = styled.Text`
  font-weight: bold;
  font-size: 19px;
  color: ${props => props.theme.bgColor};
`;

const ExplainText = styled.Text`
  color: ${colors.green};
  font-size: 25px;
  margin-bottom: 10px;
  align-content: center;
`;

const SubExplainText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 25px;
  margin-bottom: 10px;
  text-align: center;
  width: 90%;
`;

export default function GreenLightAlarm({
  navigation,
  route: {params: alarm},
}: greenLightAlarmProps) {
  const screenWidth = useWindowDimensions().width;
  const imageSize = screenWidth * 0.8; // 80% of the screen width
  const client = useApolloClient();

  useEffect(() => {
    console.log(alarm);
  }, []);

  // const updateReadMessage = (
  //   cache: ApolloCache<any>,
  //   result: FetchResult<any>,
  // ) => {
  //   if (!result.data.readAlarm.ok) {
  //     console.log('error happened');
  //     client.cache.modify({
  //       id: `Alarm:${alarm.alarm.id}`,
  //       fields: {
  //         read(currentReadStatus) {
  //           console.log('currentReadStatus >>> ', currentReadStatus);
  //           return false;
  //         },
  //       },
  //     });
  //   }
  // };

  const [readAlarm] = useReadAlarmMutation({
    variables: {
      readAlarmId: alarm.alarm.id,
    },
    // update: updateReadMessage,
  });

  useEffect(() => {
    if (!alarm.alarm.read) {
      console.log('need to read alarm');
      client.cache.modify({
        id: `Alarm:${alarm.alarm.id}`,
        fields: {
          read(currentReadStatus) {
            console.log('currentReadStatus >>> ', currentReadStatus);
            return true;
          },
        },
      });
      readAlarm()
        .then(r => console.log(r))
        .catch(error => console.log(error));
    }
  }, [alarm.alarm.read]);

  const goToProfile = (id?: Maybe<Scalars['Int']['output']> | undefined) => {
    if (!id) {
      console.error('targetId is null or undefined');
      return;
    }
    navigation.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {id},
    });
  };

  return (
    <ScreenLayout loading={false}>
      <AvatarImg avatarPath={alarm.alarm.alarmImg} size={imageSize} />
      <ExplainText>Congrats!!!</ExplainText>
      <SubExplainText>{alarm.alarm.detail}</SubExplainText>
      <ButtonContainer>
        <LeftStyledButton onPress={() => goToProfile(alarm?.alarm?.targetId)}>
          <LeftButtonText>Go To Profile</LeftButtonText>
        </LeftStyledButton>
        <RightStyledButton onPress={() => console.log('Button 2 pressed')}>
          <RightButtonText>Go Back</RightButtonText>
        </RightStyledButton>
      </ButtonContainer>
    </ScreenLayout>
  );
}
