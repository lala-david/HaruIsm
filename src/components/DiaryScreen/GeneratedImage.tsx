import React from 'react';

import {
  View,
  Image,
  StyleSheet,
  Share,
  Text,
  TouchableOpacity,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {eventEmitter} from './Gallery';

type GeneratedImageScreenProp = StackNavigationProp<
  RootStackParamList,
  'GeneratedImage'
>;

type GeneratedImageProps = {
  route: RouteProp<RootStackParamList, 'GeneratedImage'>;
  navigation: GeneratedImageScreenProp;
};

const GeneratedImage: React.FC<GeneratedImageProps> = ({route, navigation}) => {
  const {image} = route.params;

  const handleSave = async () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await AsyncStorage.setItem(`${dateString}-image`, image);
    eventEmitter.emit('imageChanged', dateString);
    navigation.navigate('Calendar'); // Add this line
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `data:image/png;base64,${image}`,
        url: `data:image/png;base64,${image}`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tt}>
        <Text style={styles.tt1}> AI가 분석을 통해 일기를</Text>
        <Text style={styles.tt1}>그림으로 변환했어요!</Text>
      </View>
      <Image
        source={{uri: `data:image/png;base64,${image}`}}
        style={styles.image}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleShare} style={styles.button1}>
          <Text style={styles.buttonText}>공유</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.button2}>
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tt: {
    alignItems: 'center',
    Top: 50,
  },
  tt1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  image: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  button1: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 105,
    marginBottom: 10,
    top: 0,
    left: 38,
    width: 120,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 105,
    marginBottom: 10,
    top: 0,
    right: 40,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default GeneratedImage;
