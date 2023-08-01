import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ParamListBase} from '@react-navigation/core';

type SettingScreenProps = StackScreenProps<ParamListBase, 'Setting'>;

type SettingItem = {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
};

const Item = ({title, icon, onPress}: Omit<SettingItem, 'id'>) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Image style={styles.leftIcon} source={icon} />
    <Text style={styles.itemTitle}>{title}</Text>
    <Image
      style={styles.rightIcon}
      source={require('../../assets/img/오른쪽화살표.png')}
    />
  </TouchableOpacity>
);

const Setting = ({navigation}: SettingScreenProps) => {
  const settingsData: SettingItem[] = [
    {
      id: '1',
      title: '계정',
      icon: require('../../assets/img/계정.png'),
      onPress: () => navigation.navigate('Account'),
    },
    {
      id: '2',
      title: '알림',
      icon: require('../../assets/img/알림.png'),
      onPress: () => navigation.navigate('Alarm'),
    },
    {
      id: '3',
      title: '공지사항',
      icon: require('../../assets/img/공지사항.png'),
      onPress: () => navigation.navigate('Announcement'),
    },
    {
      id: '4',
      title: '프리미엄',
      icon: require('../../assets/img/프리미엄.png'),
      onPress: () => navigation.navigate('Premium'),
    },
    {
      id: '5',
      title: '정보',
      icon: require('../../assets/img/정보.png'),
      onPress: () => navigation.navigate('Info'),
    },
    {
      id: '6',
      title: '문의',
      icon: require('../../assets/img/알림.png'),
      onPress: () => navigation.navigate('Inquiry'),
    },
    {
      id: '7',
      title: '친구추가',
      icon: require('../../assets/img/친구추가.png'),
      onPress: () => navigation.navigate('Friend'),
    },
  ];

  const renderSettingItem = ({item}: {item: SettingItem}) => (
    <Item title={item.title} icon={item.icon} onPress={item.onPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={require('../../assets/img/프로필.png')}
          />
          <Text style={styles.userName}>좋음이</Text>
        </View>
        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>0</Text>
            <Text style={styles.followText}>팔로워</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>0</Text>
            <Text style={styles.followText}>팔로잉</Text>
          </View>
          <View style={styles.followItem}>
            <TouchableOpacity onPress={() => navigation.navigate('Friend')}>
              <Image
                style={styles.addFriend}
                source={require('../../assets/img/친구추가.png')}
              />
            </TouchableOpacity>
            <Text
              style={styles.AddText}
              onPress={() => navigation.navigate('Friend')}>
              친구추가
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={settingsData}
        renderItem={renderSettingItem}
        keyExtractor={item => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  addFriend: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: -15,
    marginLeft: 16,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
  },
  profileContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: -20,
    marginLeft: 16,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 14,
  },

  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 50,
  },
  followItem: {
    marginLeft: 30,
  },
  followNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
    paddingLeft: 6,
    marginTop: -20,
  },
  followText: {
    fontSize: 14,
    color: '#000',
    paddingLeft: 7,
    fontWeight: 'bold',
  },
  AddText: {
    fontSize: 14,
    color: '#000',
    paddingRight: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },
  flatList: {
    width: '100%',
    marginTop: -20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10, // 수정
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    flex: 1,
  },
  rightIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
});

export default Setting;
