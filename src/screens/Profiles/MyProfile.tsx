import {useDetailMeQuery, useFollowUserMutation} from '../../generated/graphql';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  NonNullableDetailMeQuery,
  RootStackParamList,
} from '../../shared/shared.types';
import Loading from '../../components/Loading';
import AvatarImg from '../../components/users/AvatarImg';
import {
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {colors} from '../../colors';
import {logUserOut} from '../../apollo';
import Icon from 'react-native-vector-icons/Ionicons';
import {calculateAge} from '../../hooks/Utils';

type MyProfileProps = NativeStackScreenProps<RootStackParamList, 'MyProfile'>;

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
  height: 50%;
`;

const PostContainer = styled.View``;

const UserContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const TopContainer = styled.View`
  padding: 55px 15px 0;
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
  color: ${props => props.theme.fontColor};
  font-size: 15px;
  margin-top: 2px;
`;

const UserInfoContainer = styled.View<{width: number}>`
  flex-direction: row;
  margin-left: 10px;
  align-items: center;
  width: ${props => props.width - 120}px;
`;

const Username = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: bold;
  font-size: 18px;
`;

const AvatarContainer = styled.TouchableOpacity``;

const Bio = styled.Text`
  color: ${props => props.theme.fontColor};
  font-size: 15px;
  margin-top: 3px;
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
  background-color: gray;
`;

const ProfilePhoto = styled.Image<{width: number}>`
  width: ${props => props.width / 5}px;
  height: ${props => props.width / 5}px;
`;

const GapView = styled.View`
  height: 10px;
  width: 100%;
`;

export default function MyProfile({navigation, route}: MyProfileProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  console.log('navigation >>>', navigation);

  const {data: meData, loading: meLoading, refetch} = useDetailMeQuery();

  console.log('meData : ', meData);

  const {width} = useWindowDimensions();

  const photoSize = width / 5;

  const zoomInPhoto = (url: any): void => {
    if (typeof url === 'string') {
      setPhotoUrl(url);
      setModalVisible(true);
    }
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

  const originalPhotos = meData?.me?.photos || [];
  // Ensure the array has exactly 4 items, filling with null for empty spots
  const preparedPhotos = originalPhotos.slice(0, 4); // Take the first four, if there are more
  while (preparedPhotos.length < 4) {
    preparedPhotos.push(null); // Fill with null for empty spots
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logUserOut}>
          <Icon
            name="exit-outline"
            size={25}
            color="white"
            style={{marginRight: 15}}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const refreshData = async () => {
      setIsRefreshing(true);
      await refetch();
      setIsRefreshing(false);
    };

    if (route.params?.refresh) {
      refreshData();
      // Reset the refresh parameter to avoid unnecessary refetches
      navigation.setParams({refresh: false});
    }
  }, [route.params?.refresh, refetch, navigation]);

  const goToEdit = () => {
    console.log('go to edit');
    // eslint-disable-next-line prettier/prettier
    const nonNullableMeData: NonNullableDetailMeQuery = meData as NonNullableDetailMeQuery;
    navigation.navigate('StackProfileNav', {
      screen: 'EditProfile',
      params: {editData: nonNullableMeData},
    });
  };

  const goToMatches = () => {
    console.log('go to matches!!!');
    navigation.navigate('StackProfileNav', {
      screen: 'MatchesTab',
    });
  };

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
      {meLoading || isRefreshing ? (
        <Loading />
      ) : (
        <ProfileContainer>
          <TopContainer>
            <UserContainer>
              <AvatarContainer onPress={() => zoomInPhoto(meData?.me?.avatar)}>
                <AvatarImg avatarPath={meData?.me?.avatar} size={90} />
              </AvatarContainer>
              <UserInfoContainer width={width}>
                <PostContainer>
                  <CommonText>{meData?.me?.description}</CommonText>
                </PostContainer>
              </UserInfoContainer>
            </UserContainer>
            <UserActionContainer>
              <Username>{meData?.me?.username}</Username>
              <Bio>gender :{meData?.me?.sex === 'F' ? ' Female' : ' Male'}</Bio>
              <Bio>age : {calculateAge(meData?.me?.birthDay)}</Bio>
              <Buttons>
                <LeftActionButton onPress={goToMatches}>
                  <LeftActionButtonText>Matches</LeftActionButtonText>
                </LeftActionButton>
                <RightActionButton onPress={goToEdit}>
                  <RightActionText>Edit Profile</RightActionText>
                </RightActionButton>
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
