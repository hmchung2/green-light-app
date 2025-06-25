import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {User} from '../../generated/graphql.ts';
import AvatarImg from '../users/AvatarImg.tsx';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../shared/shared.types.ts';
import {SeparatorView} from '../flatList/SeparatorView.tsx';

interface SideBarProps {
  currentUsers: User[];
  isLoading: boolean;
  onClose: () => void;
  onEndReached: () => void;
}

interface RenderItemProps {
  item: User;
}

const Data = styled.View``;

const Username = styled.Text`
  color: ${props => props.theme.fontColor};
  font-weight: 600;
  font-size: 16px;
  padding-left: 10px;
`;

const Column = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const SidebarView = styled.View`
  background-color: ${props => props.theme.bgColor};
  flex-direction: row;
  flex: 1;
`;

type RoomItemNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SideBar = ({
  currentUsers,
  isLoading,
  onClose,
  onEndReached,
}: SideBarProps) => {
  const navigation = useNavigation<RoomItemNavigationProps>();

  const goToProfile = (id: number) => {
    // Navigate to 'SimpleProfile' screen within 'ProfileStackNav'
    // navigation.navigate('StackProfileNav', {
    //   screen: 'SimpleProfile',
    //   params: {id, username},
    // });
    navigation.navigate('StackProfileNav', {
      screen: 'SimpleProfile',
      params: {
        id: id,
      },
    });
  };

  const renderItem = ({item}: RenderItemProps) => {
    console.log('item : ', item);
    return (
      <TouchableOpacity onPress={() => goToProfile(item.id)}>
        <Column>
          <AvatarImg
            avatarPath={item.avatar ? item.avatar : undefined}
            size={70}
          />
          <Data>
            <Username>{item.username}</Username>
          </Data>
        </Column>
      </TouchableOpacity>
    );
  };

  return (
    <SidebarView>
      <FlatList
        data={currentUsers}
        renderItem={renderItem}
        keyExtractor={item => '' + item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        ItemSeparatorComponent={SeparatorView}
      />
    </SidebarView>
  );
};
export default SideBar;
