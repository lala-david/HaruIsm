import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TodoScreen1 from './components/TodoScreen/TodoScreen';
import ChartScrren1 from './components/ChartScreen/ChartScrren';
import CalendarView from './components/DiaryScreen/CalendarView';
import Daily from './components/DiaryScreen/Daily';
import GeneratedImage from './components/DiaryScreen/GeneratedImage';
import Gallery from './components/DiaryScreen/Gallery';
import Setting from './components/SettingScreen/Setting';
import Account from './components/SettingScreen/page/account';
import Alarm from './components/SettingScreen/page/alarm';
import Announcement from './components/SettingScreen/page/announcement';
import Premium from './components/SettingScreen/page/premium';
import Info from './components/SettingScreen/page/info';
import Inquiry from './components/SettingScreen/page/inquiry';
import Friend from './components/SettingScreen/page/Friend';
import {RootStackParamList} from './types/types';
import Loading from './components/DiaryScreen/Loading';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function TodoScreen() {
  return <TodoScreen1 />;
}

function ChartScreen() {
  return <ChartScrren1 />;
}

const CalendarStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Calendar" component={CalendarView} />
    <Stack.Screen name="Daily" component={Daily} />
    <Stack.Screen name="GeneratedImage" component={GeneratedImage} />
    <Stack.Screen name="Gallery" component={Gallery} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen name="Alarm" component={Alarm} />
    <Stack.Screen name="Announcement" component={Announcement} />
    <Stack.Screen name="Premium" component={Premium} />
    <Stack.Screen name="Info" component={Info} />
    <Stack.Screen name="Inquiry" component={Inquiry} />
    <Stack.Screen name="Friend" component={Friend} />
    <Stack.Screen name="Loading" component={Loading} />
  </Stack.Navigator>
);

const SettingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Setting" component={Setting} />
  </Stack.Navigator>
);

function BottomTabNavigationApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#1C7892',
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}>
        <Tab.Screen
          name="Todo"
          component={TodoScreen}
          options={({navigation}) => ({
            title: '투두',
            tabBarIcon: ({color, size}) => {
              const isFocused = navigation.isFocused();
              return (
                <Image
                  source={
                    isFocused
                      ? require('./assets/img/PropertyHome1.png')
                      : require('./assets/img/PropertyHome2.png')
                  }
                  style={{width: size, height: size, tintColor: color}}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name="Chart"
          component={ChartScreen}
          options={({navigation}) => ({
            title: '분석',
            tabBarIcon: ({color, size}) => {
              const isFocused = navigation.isFocused();
              return (
                <Image
                  source={
                    isFocused
                      ? require('./assets/img/PropertyChart1.png')
                      : require('./assets/img/PropertyChart2.png')
                  }
                  style={{width: size, height: size, tintColor: color}}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name="calendar"
          component={CalendarStack}
          options={({navigation}) => ({
            title: '일기',
            tabBarIcon: ({color, size}) => {
              const isFocused = navigation.isFocused();
              return (
                <Image
                  source={
                    isFocused
                      ? require('./assets/img/PropertyDaily1.png')
                      : require('./assets/img/PropertyDaily2.png')
                  }
                  style={{width: size, height: size, tintColor: color}}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name="setting"
          component={SettingStack}
          options={({navigation}) => ({
            title: '설정',
            tabBarIcon: ({color, size}) => {
              const isFocused = navigation.isFocused();
              return (
                <Image
                  source={
                    isFocused
                      ? require('./assets/img/PropertySetting1.png')
                      : require('./assets/img/PropertySetting2.png')
                  }
                  style={{width: size, height: size, tintColor: color}}
                />
              );
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNavigationApp;
