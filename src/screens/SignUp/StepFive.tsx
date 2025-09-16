import React, {useEffect, useContext} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthButton from '../../components/auth/AuthButton';
import {styled} from 'styled-components/native';
import {colors} from '../../colors';
import StepBar from './StepBar';
import {SignUpAppContext} from '../../hooks/SignUpContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  CreateAccountValidPage,
  RootStackParamList,
} from '../../shared/shared.types';
import * as ImagePicker from 'expo-image-picker';

type StepFiveProps = NativeStackScreenProps<RootStackParamList, 'StepFive'>;

const BtnContainer = styled.View`
  width: 80%;
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 100px;
`;

const IconContainer = styled.View`
  flex: 4;
  align-items: center;
  width: 80%;
`;

const SkipTouchableOpacity = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${colors.green};
  border-radius: 3px;
  padding: 15px 10px;
`;

const SkipLink = styled.Text`
  color: ${colors.green};
  font-weight: 600;
  text-align: center;
`;

const ExplainText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 25px;
  margin-bottom: 10px;
  align-self: baseline;
  align-content: center;
`;

const SubExplainText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 15px;
  margin-bottom: 10px;
  align-self: baseline;
  width: 90%;
`;

const RemoveIconTouchable = styled.TouchableOpacity`
  z-index: 2;
  height: 70px;
  width: 70px;
  border-radius: 35px;
  margin-top: 5px;
  align-items: center;
`;

export default function StepFive({navigation}: StepFiveProps) {
  const {avatarUri, setAvatarUri, visitedSteps, setVisitedSteps} =
    useContext(SignUpAppContext);
  const currentStep = 'StepFive';

  useEffect(() => {
    setVisitedSteps([...visitedSteps, currentStep]);
  }, []);

  const handleRemoveAvatar = () => {
    setAvatarUri(null);
  };

  const handleNext = (nextPage: keyof RootStackParamList) => {
    navigation.navigate(nextPage as CreateAccountValidPage);
  };

  const HeaderBar = () => (
    <StepBar
      currentStep={currentStep}
      visitedSteps={visitedSteps}
      onBeforeNavigate={handleNext}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: HeaderBar,
    });
  }, [avatarUri, visitedSteps]);

  const handleAvatarPress = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('사진 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // 정사각형 크롭
        quality: 0.7,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setAvatarUri(selectedAsset.uri);
      }
    } catch (e) {
      console.error('Error picking image:', e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
      }}>
      <IconContainer>
        <ExplainText>Add Your Profile Picture</ExplainText>
        <SubExplainText>
          Adding a face picture lets other users recognize you better. Your
          profile picture will be shown to everybody
        </SubExplainText>
        <TouchableOpacity onPress={handleAvatarPress}>
          <View
            style={{
              height: 200,
              width: 200,
              borderRadius: 175,
              backgroundColor: 'gray',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginTop: 15,
              zIndex: 0,
            }}>
            {avatarUri ? (
              <Image
                source={{uri: avatarUri}}
                style={{height: 200, width: 200}}
              />
            ) : (
              <Icon name="person" size={80} color="white" />
            )}
          </View>
        </TouchableOpacity>
        {avatarUri && (
          <RemoveIconTouchable onPress={handleRemoveAvatar}>
            <Icon name="close-circle" size={40} color="white" />
          </RemoveIconTouchable>
        )}
      </IconContainer>

      <BtnContainer>
        <AuthButton
          text={avatarUri ? 'Create Account' : 'Add Picture'}
          onPress={
            avatarUri ? () => handleNext('ConditionStep') : handleAvatarPress
          }
        />
        <SkipTouchableOpacity
          onPress={
            avatarUri ? handleAvatarPress : () => handleNext('ConditionStep')
          }>
          <SkipLink>{avatarUri ? 'Edit Photo' : 'Skip'}</SkipLink>
        </SkipTouchableOpacity>
      </BtnContainer>
    </View>
  );
}
