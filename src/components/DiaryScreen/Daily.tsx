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
import DateTimePicker from '@react-native-community/datetimepicker';
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

const API_SERVER_URL = 'http://10.0.2.2:3000';

const Daily: React.FC<DailyProps> = ({navigation, route}) => {
  const [contentText, setContentText] = useState('');
  const [titleText, setTitleText] = useState(''); // 제목 추가
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const onChangeDate = async (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      await handleSave();
      setDate(selectedDate);
    }
  };

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

  const deleteDiary = async () => {
    try {
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      await AsyncStorage.removeItem(dateString);
      await loadStoredData();
      console.log('Diary deleted');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDrawEmotion = async () => {
    const unsavedImages = await loadImages();
    if (unsavedImages.length >= 20) {
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
          📖 오늘의 하루를 한줄의 일기로 작성해 봐요!
        </Text>
        <View style={styles.box1}>
          <TouchableOpacity
            style={styles.selectdate}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.ttp}>
              {`${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(
                date.getDate(),
              ).padStart(2, '0')}일`}
            </Text>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteDiary}>
              <Text style={styles.deleteButtonText}> x </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
        </View>
        <TextInput
          style={styles.titleInput}
          onChangeText={setTitleText}
          value={titleText}
          maxLength={50}
          placeholder="제목을 입력해주세요"
        />
        <TextInput
          style={styles.input}
          onChangeText={setContentText}
          value={contentText}
          maxLength={80}
          multiline={true}
        />
        <TouchableOpacity
          style={styles.emotionButton}
          onPress={handleDrawEmotion}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>그림 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleOpenGallery}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>갤러리</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    bottom: 0,
    left: 16,
    color: 'black',
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
    paddingVertical: 13,
    paddingHorizontal: 70,
    borderRadius: 105,
    marginBottom: 10,
    top: 5,
    left: 85,
    width: 200,
    alignItems: 'center',
  },
  galleryButton: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 13,
    paddingHorizontal: 70,
    borderRadius: 105,
    marginBottom: 10,
    top: 7,
    left: 85,
    width: 200,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    left: 5,
    bottom: 10,
  },
  titleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    height: 180,
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 16,
  },

  addButton1: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 105,
    marginBottom: 10,
    top: 40,
    left: 20,
    width: 330,
  },
  addButtonText1: {
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  addButton2: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 105,
    marginBottom: 10,
    top: 50,
    left: 20,
    width: 330,
  },
  addButtonText2: {
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  addButton3: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 105,
    marginBottom: 10,
    top: 60,
    left: 20,
    width: 330,
  },
  addButtonText3: {
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    left: 350,
  },
  deleteButtonText: {
    backgroundColor: '#9cd6e5',
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Daily;
