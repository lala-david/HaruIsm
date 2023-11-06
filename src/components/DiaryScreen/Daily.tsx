import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {eventEmitter} from './Gallery';

type DailyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Daily'
>;

type DailyProps = {
  navigation: DailyScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'Daily'>;
};

// 10.0.2.2:3000
const API_SERVER_URL = 'http://10.0.2.2:3000';

const Daily: React.FC<DailyProps> = ({navigation, route}) => {
  const [contentText, setContentText] = useState('');
  const [titleText, setTitleText] = useState(''); // 제목 추가
  const [date, setDate] = useState(new Date());

  const handleOpenGallery = () => {
    const selectedDateTag = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    navigation.navigate('Gallery', {tag: selectedDateTag});
  };

  const {date: propDate} = route.params;

  useEffect(() => {
    if (propDate) {
      setDate(new Date(propDate));
    }
  }, [propDate]);

  const loadStoredData = useCallback(async () => {
    try {
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const value = await AsyncStorage.getItem(dateString);

      if (!value) {
        setTitleText('');
        setContentText('');
        return;
      }

      const storedData = JSON.parse(value);
      if (!storedData) {
        setTitleText('');
        setContentText('');
        return;
      }

      setTitleText(storedData.title || '');
      setContentText(storedData.content || '');
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  }, [date]);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const handleSave = async () => {
    try {
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      await AsyncStorage.setItem(
        dateString,
        JSON.stringify({title: titleText, content: contentText}),
      );
      await loadStoredData();
      console.log('Content saved');
    } catch (e) {
      console.error(e);
    }
  };

  const loadImages = async () => {
    const unsavedImages = [];
    const selectedDateTag = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let index = 1;
    try {
      while (index <= 5) {
        const imageData = await AsyncStorage.getItem(
          `image-${selectedDateTag}-${index}`,
        );
        if (imageData) {
          unsavedImages.push(imageData);
          index++;
        } else {
          break;
        }
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
    return unsavedImages;
  };

  const handleDrawEmotion = async () => {
    const unsavedImages = await loadImages();
    if (unsavedImages.length >= 50) {
      Alert.alert(
        '그림 생성 횟수 초과',
        '당일 그림은 더 이상 생성할 수 없습니다.',
      );
      return;
    }
    await handleSave();
    navigation.navigate('Loading');

    setTimeout(async () => {
      try {
        const response = await axios.post(`${API_SERVER_URL}/generate-image`, {
          text: contentText,
          model: 1,
        });
        if (response.status === 200) {
          const data = response.data;
          const generatedImage = data.image;
          const selectedDateTag = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          await AsyncStorage.setItem(
            `image-${selectedDateTag}-${unsavedImages.length + 1}`,
            generatedImage,
          );
          navigation.navigate('GeneratedImage', {image: generatedImage});
          eventEmitter.emit('imageChanged', selectedDateTag);
        } else {
          console.error(`Error response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }, 1500);
  };

  return (
    <ScrollView style={styles.main} contentContainerStyle={{paddingBottom: 70}}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {date.getFullYear()}년 {String(date.getMonth() + 1).padStart(2, '0')}
          월{String(date.getDate()).padStart(2, '0')}일
        </Text>
        <View style={styles.box1}></View>

        <View style={styles.bubble}>
          <TextInput
            style={[styles.titleInput, {backgroundColor: '#9cd6e5'}]}
            onChangeText={setTitleText}
            value={titleText}
            maxLength={50}
            placeholder="제목을 입력해주세요."
            placeholderTextColor="white"
          />
          <View style={styles.arrowContainer}>
            <View style={styles.arrowLeft} />
          </View>
        </View>

        <View style={styles.bubble}>
          <TextInput
            style={[styles.input, {backgroundColor: '#F4F4F4'}]}
            onChangeText={setContentText}
            value={contentText}
            maxLength={80}
            multiline={true}
            placeholder="내용을 입력하세요."
            placeholderTextColor="gray"
          />
          <View style={styles.arrowContainer}>
            <View style={styles.arrowRight} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.emotionButton}
          onPress={handleDrawEmotion}>
          <Text style={styles.buttontea}>그림 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleOpenGallery}>
          <Text style={styles.buttontea}>갤러리</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    bottom: 0,
    left: 0,
    color: 'black',
    textAlign: 'center',
  },
  ttp: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  selectdate: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    borderRadius: 5,
    left: 2,
    top: 25,
    width: 80,
    alignItems: 'center',
  },
  box1: {
    marginBottom: 20,
  },
  emotionButton: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 105,
    marginBottom: 10,
    top: 88,
    left: 40,
    width: 120,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 105,
    marginBottom: 10,
    top: 42,
    left: 200,
    width: 120,
    alignItems: 'center',
  },
  buttontea: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    left: 5,
    bottom: 10,
  },
  bubble: {
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'center',
  },
  titleInput: {
    height: 50,
    width: 225,
    fontSize: 17,
    borderColor: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    marginBottom: 8,
    color: 'white',
    marginTop: 15,
    paddingHorizontal: 30,
    borderRadius: 105,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 15,
  },
  arrowLeft: {
    top: -10,
    marginTop: -10,
    width: 15,
    height: 15,
    backgroundColor: '#9cd6e5',
    transform: [{rotate: '45deg'}],
  },
  input: {
    height: 286,
    width: 264,
    top: 25,
    right: 38,
    fontSize: 16,
    fontWeight: 'bold',
    borderColor: 'white',
    borderWidth: 1,
    color: 'gray',
    paddingHorizontal: 20,
    marginLeft: 82,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderRadius: 16,
  },
  arrowRight: {
    marginTop: -10,
    width: 25,
    height: 25,
    left: 260,
    top: 0,
    backgroundColor: '#F4F4F4',
    transform: [{rotate: '45deg'}],
  },
});

export default Daily;
