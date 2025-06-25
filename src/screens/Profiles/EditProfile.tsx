import React, {useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled, {css} from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types.ts';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AvatarImg from '../../components/users/AvatarImg.tsx';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../../colors.ts';
import {ReactNativeFile} from 'apollo-upload-client';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
  useEditProfileMutation,
  useValidCreateAccountLazyQuery,
} from '../../generated/graphql.ts';
import LabeledTextInput from '../../components/profile/LabeledTextInput.tsx';
import LabeledInputContainer from '../../components/profile/LabeldComponent.tsx';
import {useTheme} from 'styled-components';

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;

const PhotoModalBackground = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const GenderModalBackground = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

interface GenderButtonProps {
  icon: 'mars' | 'venus';
  label: string;
  onPress: () => void;
  isSelected: boolean;
}

const ZoomedPhoto = styled(Image)`
  width: 80%;
  height: 50%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 10px;
`;

const InputContainerView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InputContainerOpacity = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const UsernameInput = styled.TextInput`
  flex: 1.5;
  padding: 5px;
  font-size: 15px;
  margin-right: 5px;
  color: ${props => props.theme.fontColor};
`;

const InputText = styled.Text`
  color: ${props => props.theme.fontColor};
  flex: 1.5;
  padding: 5px;
  font-size: 15px;
  margin-right: 5px;
`;

const GenderButtonOpacity = styled.TouchableOpacity<{
  isSelected: boolean;
  onPress: () => void;
}>`
  align-items: center;
  background-color: grey;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  width: 40%;

  ${props =>
    props.isSelected &&
    css`
      background-color: ${colors.green};
    `}
`;

const GenderIcon = styled(Icon)`
  margin-bottom: 10px;
`;

const GenderButtonLabel = styled.Text<{isSelected: boolean}>`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;

  ${props =>
    props.isSelected &&
    css`
      color: #000;
    `}
`;

const InputIconContainer = styled.View`
  flex: 0.2;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const ValidButton = styled.TouchableOpacity<{disabled: boolean}>`
  flex: 0.2;
  background-color: ${props =>
    props.disabled ? 'rgba(128, 128, 128, 0.1)' : colors.gray};
  padding: 5px 5px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const ValidButtonText = styled.Text<{disabled: boolean}>`
  color: ${props => (props.disabled ? 'rgba(0, 128, 0, 0.6)' : colors.green)};
  font-size: 15px;
  font-weight: 400;
  text-align: center;
`;

const SaveButton = styled.TouchableOpacity<{disabled: boolean}>`
  background-color: ${props =>
    props.disabled ? 'rgba(128, 128, 128, 0.5)' : colors.gray};
  padding: 10px 10px;
  margin: 10px; /* Center horizontally */
  border-radius: 5px;
  width: 60%;
  justify-content: center;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: ${props => colors.green};
  font-size: 16px;
  font-weight: 800; /* Thicker letters */
  text-align: center;
`;

const ModalButton = styled.TouchableOpacity`
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
`;

const GrayModalButton = styled(ModalButton)`
  background-color: ${props => colors.gray};
`;

const GreenModalButton = styled(ModalButton)`
  background-color: ${props => colors.green};
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 16px;
  text-align: center;
`;

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ProfileContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const PictureContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const EditInfoContainer = styled.View`
  flex: 3;
  width: 100%;
`;

const ProfilePhotoContainer = styled.TouchableOpacity<{width: number}>`
  align-items: center;
  justify-content: center;
  width: ${props => props.width / 5}px;
  height: ${props => props.width / 5}px;
  margin: 5px;
  background-color: ${props => colors.gray};
`;

const TopContainer = styled.View`
  flex: 0.9;
  padding: 0;
  justify-content: center;
  align-items: center;
`;

const ProfilePhoto = styled.Image<{width: number}>`
  width: ${props => props.width / 5}px;
  height: ${props => props.width / 5}px;
`;

const GapView = styled.View`
  height: 10px;
  width: 100%;
`;
const PostContainer = styled.View`
  width: 100%;
`;

const AvatarCircle = styled.TouchableOpacity`
  margin-bottom: 9px;
`;

const BottomContainer = styled.View`
  flex: 2;
  padding: 10px 0 30px;
  align-items: center;
`;

const BirthModalBackground = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const SaveMessage = styled.Text`
  color: red;
  font-size: 12px;
  margin-top: 0;
  padding-top: 0;
`;

const ValidationMessage = styled.Text<{isValid: boolean | null}>`
  color: ${props => (props.isValid ? 'green' : 'red')};
  font-size: 12px;
  margin-top: 0;
  padding-top: 0;
`;

interface SimplePhoto {
  file: string | null;
  id: string | null;
  originalId: string | null;
  originalFileUrl: string | null;
}

const GenderButton = ({
  icon,
  label,
  onPress,
  isSelected,
}: GenderButtonProps) => {
  return (
    <GenderButtonOpacity isSelected={isSelected} onPress={onPress}>
      <GenderIcon name={icon} size={80} color={isSelected ? '#000' : '#fff'} />
      <GenderButtonLabel isSelected={isSelected}>{label}</GenderButtonLabel>
    </GenderButtonOpacity>
  );
};

export default function EditProfile({navigation, route}: EditProfileProps) {
  const {editData} = route.params;
  const theme = useTheme();

  const photoNumber = 4;

  const [updatingPhotos, setUpdatingPhotos] = useState<SimplePhoto[]>(() => {
    const originalPhotos =
      editData.me.photos?.map((p: any) => ({
        file: p.file || null,
        id: p.id || null,
        originalId: p.id || null,
        originalFileUrl: p.file || null,
      })) || [];
    const initialPhotos = originalPhotos.slice(0, photoNumber);
    while (initialPhotos.length < photoNumber) {
      initialPhotos.push({
        file: null,
        id: null,
        originalId: null,
        originalFileUrl: null,
      }); // Fill with null for empty spots
    }
    return initialPhotos;
  });

  const [photoModalVisible, setPhotoModalVisible] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);
  const [birthModalVisible, setBirthModalVisible] = useState<boolean>(false);

  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const [avatarModalVisible, setAvatarModalVisible] = useState<boolean>(false);

  const [saveMessage, setSaveMessage] = useState<string>('');

  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true); // Add a state to track validation

  const showPhotoModal = (index: number) => {
    console.log('show modal : ', index);
    setSelectedPhotoIndex(index);
    setPhotoModalVisible(true);
  };

  const closePhotoModal = () => {
    setPhotoModalVisible(false);
    setSelectedPhotoIndex(0);
  };

  const [validDisabled, setValidDisabled] = useState<boolean>(true);

  const [username, setUsername] = useState<string>(editData.me.username);

  const [description, setDescription] = useState<string>(
    editData.me.description || '',
  );

  const [gender, setGender] = useState<string>(editData.me.sex);

  const [birthDay, setBirthDay] = useState<string>(editData.me.birthDay);

  const [avatar, setAvatar] = useState<string | null>(
    editData.me.avatar ?? null,
  );

  const {width} = useWindowDimensions();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleGenderSelection = (g: 'M' | 'F') => {
    setGender(g);
    setGenderModalVisible(false);
  };

  const removePhoto = (index: number | null) => {
    closePhotoModal();
    if (index != null) {
      const updatedPhotos = [...updatingPhotos];
      updatedPhotos[index].file = null; // Remove the photo at the selected index
      updatedPhotos[index].id = null;
      setUpdatingPhotos(updatedPhotos);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const photoClicked = async (index: number) => {
    if (updatingPhotos[index].file != null) {
      return showPhotoModal(index);
    } else {
      return updatePhoto(index);
    }
  };

  const avatarClicked = async () => {
    console.log('avatar : ', avatar);
    if (avatar !== null) {
      setAvatarModalVisible(true);
    } else {
      await updateAvatar();
    }
  };

  const [checkDuplicate, {loading: validLoading}] =
    useValidCreateAccountLazyQuery({
      onCompleted: data => {
        console.log('checkDuplicate : ', data);
        if (data?.validCreateAccount?.ok) {
          setValidationMessage('Username is valid'); // Show success message
          setIsUsernameValid(true);
        } else {
          setValidationMessage('Username is already taken.'); // Show error message
          setIsUsernameValid(false);
        }
        setSaveMessage('');
      },
      onError: error => {
        console.log(error);
        setValidationMessage('Network issue, please try again later.');
        setSaveMessage('');
        setIsUsernameValid(false);
      },
    });

  const validateAccount = async (checkingUsername: string) => {
    console.log('checking username -> ', checkingUsername);
    if (username !== editData.me.username) {
      await checkDuplicate({variables: {username}});
    } else {
      console.log('not checking due to not changed username');
    }
  };

  const updatePhoto = async (index: number) => {
    closePhotoModal();
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };
    // @ts-ignore
    const result = await launchImageLibrary(options);
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const selectedPhotoUri = result.assets[0].uri;
      if (selectedPhotoUri) {
        const updatedPhotos = [...updatingPhotos];
        updatedPhotos[index].file = selectedPhotoUri; // Update the photo at the selected index
        updatedPhotos[index].id = null;
        setUpdatingPhotos(updatedPhotos);
      }
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <ProfilePhotoContainer onPress={() => photoClicked(index)} width={width}>
        {item.file ? (
          <ProfilePhoto width={width} source={{uri: item.file}} />
        ) : (
          <ButtonText>Add</ButtonText>
          // <Icon name="plus" size={photoSize / 2} color="#ffffff" />
        )}
      </ProfilePhotoContainer>
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const RowSeparator = () => <GapView />;

  const [editProfileMutation, {loading: editProfileLoading}] =
    useEditProfileMutation({
      onCompleted: (data: EditProfileMutation) => {
        if (data.editProfile.ok) {
          console.log('Profile updated successfully');
          setSaveMessage('');
          // You can add navigation or success feedback here
          navigation.navigate('MyProfile', {refresh: true});
        } else {
          console.error('Error updating profile:', data.editProfile.error);
          setSaveMessage('Unknown Error saving profile');
        }
      },
    });

  const usernameOnChange = (text: string) => {
    setUsername(text);
    setValidationMessage(null);
    if (text === editData.me.username) {
      setValidDisabled(true);
      setIsUsernameValid(true);
    } else {
      setValidDisabled(false);
      setIsUsernameValid(false);
    }
  };

  const hasChanges = () => {
    if (avatar !== editData.me.avatar) {
      return true;
    }
    if (username !== editData.me.username) {
      return true;
    }
    if (description !== editData.me.description) {
      return true;
    }
    if (gender !== editData.me.sex) {
      return true;
    }
    if (birthDay !== editData.me.birthDay) {
      return true;
    }

    for (let i = 0; i < updatingPhotos.length; i++) {
      if (updatingPhotos[i].originalFileUrl !== updatingPhotos[i].file) {
        return true;
      }
    }
    return false;
  };

  const saveProfile = async () => {
    if (!hasChanges()) {
      console.log('nothing to save');
      setSaveMessage('No changes to save.');
      return;
    }

    if (!isUsernameValid) {
      setSaveMessage('Please validate new username');
      return;
    }

    const newPhotos = updatingPhotos.map(photo => {
      // @ts-ignore
      const fileName = photo.file ? photo.file.split('/').pop() : null;
      // @ts-ignore
      const fileType = fileName ? fileName.split('.').pop() : null;
      return {
        id: photo.id ? Number(photo.id) : null, // Ensure id is a number or null
        originalId: photo.originalId ? Number(photo.originalId) : null,
        originalFileUrl: photo.originalFileUrl ? photo.originalFileUrl : null,
        file: photo.file
          ? new ReactNativeFile({
              uri: photo.file,
              type: `image/${fileType}`, // Use the file extension to determine the type
              name: fileName || `${username}-avatar.jpg`, // Use the original name or generate a new one
            })
          : null, // Set to null if there's no file
      };
    });

    const updatedData: EditProfileMutationVariables = {photos: newPhotos};

    if (avatar !== editData.me.avatar) {
      updatedData.avatar = new ReactNativeFile({
        uri: avatar,
        name: `${username}-avatar.jpg`,
        type: 'image/jpeg',
      });
    }

    if (username !== editData.me.username) {
      if (!isUsernameValid) {
        setSaveMessage('please validate your username');
        return;
      }
      updatedData.username = username;
    }

    if (description !== editData.me.description) {
      updatedData.description = description;
    }

    if (gender !== editData.me.sex) {
      updatedData.gender = gender;
    }

    if (birthDay !== editData.me.birthDay) {
      updatedData.birthDay = new Date(parseInt(birthDay, 10)).toISOString();
    }
    console.log('updatedData : ', updatedData);

    try {
      await editProfileMutation({
        variables: updatedData,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleBirthDateChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || new Date(parseInt(birthDay, 10));
    setBirthDay(currentDate.getTime() + '');
    setBirthModalVisible(false);
  };

  const updateAvatar = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };
    // @ts-ignore
    const result = await launchImageLibrary(options);
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      const selectedAvatarUri = result.assets[0].uri;
      if (selectedAvatarUri) {
        setAvatar(selectedAvatarUri);
      }
    }
    setAvatarModalVisible(false);
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarModalVisible(false);
  };

  return (
    <Container>
      <Modal
        animationType="fade"
        visible={avatarModalVisible}
        transparent={true}
        onRequestClose={() => setAvatarModalVisible(false)}>
        <PhotoModalBackground onPress={() => setAvatarModalVisible(false)}>
          {avatar && <ZoomedPhoto source={{uri: avatar}} />}
          <ButtonContainer>
            <GreenModalButton onPress={updateAvatar}>
              <ButtonText>Update</ButtonText>
            </GreenModalButton>
            <GrayModalButton onPress={removeAvatar}>
              <ButtonText>Remove</ButtonText>
            </GrayModalButton>
          </ButtonContainer>
        </PhotoModalBackground>
      </Modal>
      <Modal
        animationType="fade"
        visible={photoModalVisible}
        transparent={true}
        onRequestClose={closePhotoModal}>
        <PhotoModalBackground onPress={closePhotoModal}>
          {updatingPhotos[selectedPhotoIndex].file && (
            <ZoomedPhoto
              source={{uri: updatingPhotos[selectedPhotoIndex].file || ''}}
            />
          )}
          {updatingPhotos[selectedPhotoIndex].file && (
            <ButtonContainer>
              <GreenModalButton onPress={() => updatePhoto(selectedPhotoIndex)}>
                <ButtonText>Update</ButtonText>
              </GreenModalButton>
              <GrayModalButton onPress={() => removePhoto(selectedPhotoIndex)}>
                <ButtonText>Remove</ButtonText>
              </GrayModalButton>
            </ButtonContainer>
          )}
        </PhotoModalBackground>
      </Modal>
      <Modal
        animationType="fade"
        visible={genderModalVisible}
        transparent={true}
        onRequestClose={() => setGenderModalVisible(false)}>
        <GenderModalBackground onPress={() => setGenderModalVisible(false)}>
          <GenderButton
            icon="mars"
            label="Male"
            onPress={() => handleGenderSelection('M')}
            isSelected={gender === 'M'}
          />
          <GenderButton
            icon="venus"
            label="Female"
            onPress={() => handleGenderSelection('F')}
            isSelected={gender === 'F'}
          />
        </GenderModalBackground>
      </Modal>
      <Modal
        animationType="fade"
        visible={birthModalVisible}
        transparent={true}
        onRequestClose={() => setBirthModalVisible(false)}>
        <BirthModalBackground onPress={() => setBirthModalVisible(false)}>
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(parseInt(birthDay, 10))}
            mode="date"
            display="spinner"
            onChange={handleBirthDateChange}
          />
        </BirthModalBackground>
      </Modal>
      <ProfileContainer>
        {!isKeyboardVisible && (
          <TopContainer>
            <AvatarCircle onPress={avatarClicked}>
              <AvatarImg avatarPath={avatar} size={100} />
            </AvatarCircle>
            <PictureContainer>
              <FlatList
                data={updatingPhotos}
                renderItem={renderItem}
                numColumns={4}
                keyExtractor={(item, index) =>
                  item.id ? String(item.id) : `empty-${index}`
                }
                ItemSeparatorComponent={RowSeparator}
              />
            </PictureContainer>
          </TopContainer>
        )}
        <BottomContainer>
          <EditInfoContainer>
            <LabeledInputContainer label={'username'}>
              <InputContainerView>
                <UsernameInput
                  value={username}
                  onChangeText={text => usernameOnChange(text)}
                />
                <ValidButton
                  disabled={validDisabled || validLoading}
                  onPress={() => validateAccount(username)}>
                  {validLoading ? (
                    <ActivityIndicator size="small" color={colors.green} />
                  ) : (
                    <ValidButtonText
                      disabled={
                        isUsernameValid || validDisabled || validLoading
                      }>
                      Valid
                    </ValidButtonText>
                  )}
                </ValidButton>
              </InputContainerView>
            </LabeledInputContainer>
            {validationMessage && (
              <ValidationMessage isValid={isUsernameValid}>
                {validationMessage}
              </ValidationMessage>
            )}
            <LabeledTextInput
              label="Description"
              value={description}
              onChangeText={text => setDescription(text)}
              placeholder="Enter description"
              multiline
            />
            <LabeledInputContainer label={'gender'}>
              <InputContainerOpacity
                onPress={() => setGenderModalVisible(true)}>
                <InputText>{gender === 'M' ? 'Male' : 'Female'}</InputText>
                <InputIconContainer>
                  <Icon name="angle-right" size={25} color={theme.fontColor} />
                </InputIconContainer>
              </InputContainerOpacity>
            </LabeledInputContainer>
            <LabeledInputContainer label={'Birth Day'}>
              <InputContainerOpacity onPress={() => setBirthModalVisible(true)}>
                <InputText>
                  {new Date(parseInt(birthDay, 10)).toLocaleDateString()}
                </InputText>
                <InputIconContainer>
                  <Icon name="angle-right" size={25} color={theme.fontColor} />
                </InputIconContainer>
              </InputContainerOpacity>
            </LabeledInputContainer>
          </EditInfoContainer>
          <SaveButton disabled={editProfileLoading} onPress={saveProfile}>
            {editProfileLoading ? (
              <ActivityIndicator size="small" color={colors.green} />
            ) : (
              <SaveButtonText>Save</SaveButtonText>
            )}
          </SaveButton>
          <SaveMessage>{saveMessage}</SaveMessage>
        </BottomContainer>
      </ProfileContainer>
    </Container>
  );
}
