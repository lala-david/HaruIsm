import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ParamListBase} from '@react-navigation/core';

export type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  Daily: {date: string};
  Gallery: {tag: string};
  GeneratedImage: {image: string};
  Setting: undefined;
  Account: undefined;
  Alarm: undefined;
  Announcement: undefined;
  Premium: undefined;
  Info: undefined;
  Inquiry: undefined;
  Friend: undefined;
  Loading: undefined;
};

export type BottomTabParamList = {
  CalendarStack: undefined;
  DailyStack: undefined;
  설정: undefined;
};

export type DailyRouteProp = RouteProp<RootStackParamList, 'Daily'>;
export type GalleryRouteProp = RouteProp<RootStackParamList, 'Gallery'>;
export type GeneratedImageRouteProp = RouteProp<
  RootStackParamList,
  'GeneratedImage'
>;

export type DailyNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Daily'
>;
export type GalleryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gallery'
>;
export type GeneratedImageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GeneratedImage'
>;

// 추가한 타입 설정
export type SettingScreenProps = {
  navigation: StackNavigationProp<ParamListBase, 'SettingMain'>;
};
