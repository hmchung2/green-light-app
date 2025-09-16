import {
  CreateAccountMutation,
  CreateRoomMutation,
  useCreateRoomMutation,
  useFollowUserMutation,
  useSeeSimpleProfileQuery,
  useUnfollowUserMutation,
} from '../../generated/graphql';
import React, {useEffect, useState} from 'react';
import {styled, useTheme} from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types';
import Loading from '../../components/Loading';
import AvatarImg from '../../components/users/AvatarImg';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {colors} from '../../colors';
import {logUserOut} from '../../apollo';
import Icon from 'react-native-vector-icons/Ionicons';
import {calculateAge} from '@/src/hooks/Utils';

type SimpleProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'SimpleProfile'
>;

const ProfileContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const ModalBackground = styled(TouchableOpacity)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const ZoomedPhoto = styled(Image)`
  width: 80%;
  height: 80%;
  resize-mode: contain;
`;

const PostContainer = styled.View``;

const UserContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const TopContainer = styled.View`
  padding: 15px 10px 0;
`;

const BottomContainer = styled.View`
  flex: 1;
  padding: 10px;
  align-items: center;
`;

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const UserActionContainer = styled.View`
  padding: 13px 10px;
`;

const AgeText = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;

const LeftActionButton = styled.TouchableOpacity`
  background-color: ${props => colors.green};
  padding: 5px 12px;
  border-radius: 5px;
  flex: 1;
  margin: 5px;
  justify-content: center;
  align-items: center;
  height: 38px;
`;

const LeftActionButtonText = styled.Text`
  font-weight: bold;
  color: ${props => props.theme.fontWithThemeBackground};
`;

const RightActionButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.bgContainerColor};
  border: ${props => props.theme.borderColor};
  padding: 5px 12px;
  border-radius: 5px;
  flex: 1;
  margin: 5px;
  justify-content: center;
  align-items: center;
  height: 38px;
`;

const RightActionText = styled.Text`
  font-weight: bold;
  color: ${props => props.theme.fontWithThemeBackground};
`;

const CommonText = styled.Text`
  font-size: 15px;
  margin-top: 2px;
  color: ${props => props.theme.fontColor};
`;

const UserInfoContainer = styled.View<{width: number}>`
  flex-direction: row;
  margin-left: 10px;
  align-items: center;
  width: ${props => props.width - 120}px;
`;

const Username = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.theme.fontColor};
`;

const AvatarContainer = styled.View``;

const Bio = styled.Text`
  font-size: 15px;
  margin-top: 3px;
  color: ${props => props.theme.fontColor};
`;

const Buttons = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity<{width: number}>`
  align-items: center;
  justify-content: center;
  width: ${props => props.width / 5}px;
  height: ${props => props.width / 5}px;
  margin: 5px;
  background-color: gray; /* For icons, so it matches the photo background if any */
`;

const ProfilePhoto = styled.Image<{width: number}>`
  width: ${props => props.width / 5}px;
  height: ${props => props.width / 5}px;
`;

const GapView = styled.View`
  height: 10px;
  width: 100%;
`;

export default function SimpleProfile({
  navigation,
  route: {
    params: {id},
  },
}: SimpleProfileProps) {
  const theme = useTheme();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  console.log('simple profile');

  const {data: seeProfileData, loading: seeProfileLoading} =
    useSeeSimpleProfileQuery({
      variables: {seeProfileId: id},
      onCompleted: data => {
        if (data?.seeProfile?.username) {
          navigation.setOptions({
            headerTitle: data.seeProfile.username,
          });
        }
      },
    });

  const {width} = useWindowDimensions();

  const photoSize = width / 5;

  const zoomInPhoto = (url: string): void => {
    setPhotoUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const RowSeparator = () => <GapView />;

  const renderItem = ({item: photo}: any) => {
    if (photo === null) {
      return (
        <ProfilePhotoContainer width={width}>
          <Icon name="person" size={photoSize} color="#ffffff" />
        </ProfilePhotoContainer>
      );
    }
    return (
      <ProfilePhotoContainer
        onPress={() => zoomInPhoto(photo.file)}
        width={width}>
        <ProfilePhoto width={width} source={{uri: photo.file}} />
      </ProfilePhotoContainer>
    );
  };

  const [createRoomMutation, {loading: createRoomLoading}] =
    useCreateRoomMutation({
      onCompleted: (data: CreateRoomMutation): void => {
        const {
          createRoom: {ok, error, id: roomId},
        } = data;
        if (ok && roomId && seeProfileData?.seeProfile?.username) {
          console.log('roomId ', roomId);
          navigation.navigate('StackMessagesNav', {
            screen: 'EachRoom',
            params: {
              id: roomId,
              talkingTo: seeProfileData.seeProfile.username,
            },
          });
        }
      },
    });

  const moveToMessage = async () => {
    // navigation.navigate('StackMessagesNav');
    console.log('id : ', id);
    // need to work on specific message room
    return createRoomMutation({variables: {targetId: id}}).catch(error =>
      console.log(error),
    );
  };

  const originalPhotos = seeProfileData?.seeProfile?.photos || [];
  // Ensure the array has exactly 4 items, filling with null for empty spots
  const preparedPhotos = originalPhotos.slice(0, 4); // Take the first four, if there are more
  while (preparedPhotos.length < 4) {
    preparedPhotos.push(null); // Fill with null for empty spots
  }

  const [followUserMutation, {loading: followUserLoading}] =
    useFollowUserMutation({
      update: (cache, {data}) => {
        // console.log('follow cache : ', cache);
        // console.log('follow data : ', data);
        cache.modify({
          id: `User:{"id":${data?.followUser?.id}}`,
          fields: {
            isFollowing: (isFollowing: boolean) => true,
          },
        });
      },
    });

  const [unfollowUserMutation, {loading: unfollowUserLoading}] =
    useUnfollowUserMutation({
      update: (cache, {data}) => {
        cache.modify({
          id: `User:{"id":${data?.unfollowUser?.id}}`,
          fields: {
            isFollowing: (isFollowing: boolean) => false,
          },
        });
      },
    });

  const handleToggleFollow = async () => {
    console.log(
      'Attempting to toggle follow state for user ID:',
      seeProfileData?.seeProfile?.id,
    );
    if (!seeProfileData?.seeProfile?.id) {
      console.log('No user ID found, cannot follow/unfollow');
      return; // Early return if there's no user ID
    }
    if (followUserLoading || unfollowUserLoading) {
      return;
    }

    const isCurrentlyFollowing = seeProfileData?.seeProfile?.isFollowing;
    console.log('isCurrentlyFollowing >>>', seeProfileData?.seeProfile);
    try {
      const mutationResponse = isCurrentlyFollowing
        ? await unfollowUserMutation({
            variables: {followUserId: seeProfileData.seeProfile.id},
          })
        : await followUserMutation({
            variables: {followUserId: seeProfileData.seeProfile.id},
          });
      console.log('mutationResponse >>>', mutationResponse);
    } catch (e) {
      console.error('Error during the follow/unfollow operation:', e);
    }
  };

  console.log('seeProfileData?.seeProfile : ' + seeProfileData?.seeProfile);
  console.log(seeProfileData?.seeProfile);

  return (
    <Container>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <ModalBackground activeOpacity={1} onPress={closeModal}>
          {photoUrl ? <ZoomedPhoto source={{uri: photoUrl}} /> : null}
        </ModalBackground>
      </Modal>

      {seeProfileLoading ? (
        <Loading />
      ) : (
        <ProfileContainer>
          <TopContainer>
            <UserContainer>
              <AvatarContainer>
                <AvatarImg
                  avatarPath={seeProfileData?.seeProfile?.avatar}
                  size={90}
                />
              </AvatarContainer>
              <UserInfoContainer width={width}>
                <PostContainer>
                  <CommonText>
                    {seeProfileData?.seeProfile?.description}
                  </CommonText>
                </PostContainer>
              </UserInfoContainer>
            </UserContainer>
            <UserActionContainer>
              <Username>{seeProfileData?.seeProfile?.username}</Username>
              <Bio>
                gender :
                {seeProfileData?.seeProfile?.sex === 'F' ? ' Female' : ' Male'}
              </Bio>
              <Bio>
                age : {calculateAge(seeProfileData?.seeProfile?.birthDay)}
              </Bio>
              <Buttons>
                {seeProfileData?.seeProfile?.isMe ? (
                  <LeftActionButton>
                    <LeftActionButtonText>Edit Profile</LeftActionButtonText>
                  </LeftActionButton>
                ) : (
                  <LeftActionButton
                    onPress={handleToggleFollow}
                    disabled={followUserLoading || unfollowUserLoading}>
                    {followUserLoading || unfollowUserLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <LeftActionButtonText>
                        {seeProfileData?.seeProfile?.isFollowing
                          ? 'Unfollow'
                          : 'Follow'}
                      </LeftActionButtonText>
                    )}
                  </LeftActionButton>
                )}
                {seeProfileData?.seeProfile?.isMe ? (
                  <RightActionButton onPress={logUserOut}>
                    <RightActionText>Log Out</RightActionText>
                  </RightActionButton>
                ) : (
                  <RightActionButton
                    onPress={moveToMessage}
                    disabled={
                      !(
                        seeProfileData?.seeProfile?.isFollowing &&
                        seeProfileData?.seeProfile?.isFollower
                      )
                    }>
                    {createRoomLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.fontWithThemeBackground}
                      />
                    ) : (
                      <RightActionText>Message</RightActionText>
                    )}
                  </RightActionButton>
                )}
              </Buttons>
            </UserActionContainer>
          </TopContainer>
          <BottomContainer>
            <FlatList
              data={preparedPhotos}
              renderItem={renderItem}
              numColumns={4}
              keyExtractor={(item, index) =>
                item ? String(item.id) : `empty-${index}`
              }
              ItemSeparatorComponent={RowSeparator}
            />
          </BottomContainer>
        </ProfileContainer>
      )}
    </Container>
  );
}
