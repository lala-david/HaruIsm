import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {RootStackParamList} from '../../types/types';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {eventEmitter} from './Gallery';
import {useFocusEffect} from '@react-navigation/native';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};

LocaleConfig.defaultLocale = 'ko';

LocaleConfig.defaultLocale = 'ko';

interface CalendarDay {
  dateString: string;
}

type CalendarViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: CalendarViewNavigationProp;
};

interface ContentText {
  title: string;
  content: string;
}

const CalendarView: React.FC<Props> = ({navigation}) => {
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const [contentText, setContentText] = useState<ContentText>({
    title: '',
    content: '',
  }); // 타입 변경
  const [imageUri, setImageUri] = useState('');

  const getTodayDayName = () => {
    const todayDate = new Date();
    const dayIndex = todayDate.getDay();
    return LocaleConfig.locales['ko'].dayNames[dayIndex];
  };

  const todayDayName = getTodayDayName();

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const textValue = await AsyncStorage.getItem(today);
        const imageValue = await AsyncStorage.getItem(`${today}-image`);

        if (textValue !== null) {
          const parsedData = JSON.parse(textValue);
          setContentText(parsedData);
        } else {
          setContentText({title: '', content: ''});
        }

        if (imageValue !== null) {
          setImageUri(`data:image/png;base64,${imageValue}`);
        } else {
          setImageUri('');
        }
      };

      loadData();

      const handleImageChanged = (dateString: string) => {
        console.log(`Image changed for date: ${dateString}`);
        if (dateString === today) {
          loadData(); // Call loadData() when imageChanged event occurs
        }
      };

      eventEmitter.addListener('imageChanged', handleImageChanged);

      // Clean up
      return () => {
        eventEmitter.removeAllListeners('imageChanged');
      };
    }, [today]),
  );
  const onDayPress = (day: CalendarDay) => {
    const [year, month, dayOfMonth] = day.dateString.split('-');
    navigation.navigate('Daily', {
      date: `${+year}-${+month}-${+dayOfMonth}`,
    });
  };

  const maxDateString = `${today.slice(0, 4)}-${today.slice(
    5,
    7,
  )}-${today.slice(8, 10)}`;

  const deleteImage = async () => {
    await AsyncStorage.removeItem(`${today}-image`);
    setImageUri('');
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.contentWrapper}>
        <View style={styles.container}>
          <Calendar
            style={styles.calendarContainer}
            monthTextColor={'black'}
            textMonthFontSize={90}
            onDayPress={onDayPress}
            markingType={'custom'}
            maxDate={maxDateString}
            monthFormat={'yyyy년 MM월'}
            locale={'ko'}
          />
        </View>
        <View style={styles.bottombox}>
          <View style={styles.line} />
          <Text style={styles.TitleText}>💙 일기</Text>
          <Text style={styles.TTtext}>일기 한 눈에 보기</Text>
          <ImageBackground
            style={styles.imBox}
            imageStyle={styles.immage}
            source={require('../../assets/img/box.png')}>
            <View style={styles.textBox}>
              <View style={styles.row}>
                <Text style={styles.DatecontentText}>{todayDayName}</Text>
                <View style={styles.verticalLine} />
                {contentText.title && (
                  <Text style={styles.title}>{contentText.title}</Text>
                )}
              </View>
              <View style={styles.row}>
                <Text style={styles.DaycontentText}>{today.slice(8, 10)}</Text>
                <View style={styles.verticalLinee} />
                <Text style={styles.contentText}>
                  {contentText.content
                    ? contentText.content.length > 10
                      ? `${contentText.content.slice(0, 10)} ...더 보기`
                      : contentText.content
                    : '오늘 작성한 일기가 없습니다.'}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <Text style={styles.PTitleText}>오늘의 그림 일기 🎨</Text>
          <Text style={styles.PTTtext}>그림 한 눈에 보기</Text>
          <View style={styles.imageBox}>
            {imageUri ? (
              <>
                <Image style={styles.image} source={{uri: imageUri}} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={deleteImage}>
                  <Text style={styles.deleteButtonText}>❎</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noImageText}>
                😅 오늘 저장된 이미지가 없습니다.
              </Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
  contentWrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  TitleText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    left: 50,
    top: 40,
  },
  TTtext: {
    fontSize: 14,
    color: '#B2B4B5',
    position: 'absolute',
    left: 50,
    top: 75,
  },
  PTitleText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    left: 50,
    top: 260,
  },
  PTTtext: {
    fontSize: 14,
    color: '#B2B4B5',
    fontWeight: 'bold',
    position: 'absolute',
    left: 50,
    top: 300,
  },
  line: {
    borderBottomColor: '#B2B4B5',
    borderBottomWidth: 3.79,
    width: 40,
    alignSelf: 'center',
    top: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  calendarContainer: {
    width: 300,
    height: 350,
    marginVertical: 20,
  },
  verticalLine: {
    height: 100,
    width: 3,
    position: 'absolute',
    top: -46,
    left: 45,
    backgroundColor: 'white',
  },
  verticalLinee: {
    height: 100,
    width: 3,
    position: 'absolute',
    backgroundColor: 'white',
    bottom: -45,
    left: 45,
  },
  DatecontentText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 24,
    right: -28,
  },
  DaycontentText: {
    fontSize: 35,
    color: 'black',
    position: 'absolute',
    right: -29,
    bottom: -26,
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 22,
    left: 60,
  },
  contentText: {
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    left: 60,
    bottom: -10,
  },
  bottombox: {
    backgroundColor: '#F4F4F4',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 800,
    marginBottom: -110,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  dateText: {
    fontSize: 20,
    marginBottom: 8,
  },
  textBox: {
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 25,
    paddingRight: 55,
  },
  imBox: {
    alignItems: 'flex-start',
    textAlign: 'left',
    justifyContent: 'center',
    width: '90%',
    left: 20,
    minHeight: 350,
  },
  immage: {
    resizeMode: 'contain',
  },
  imageBox: {
    width: '90%',
    top: 320,
    position: 'absolute',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: '90%',
    top: 10,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  bottomOverlay: {
    backgroundColor: '#F4F4F4',
    position: 'absolute',
    width: 100,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  noImageText: {
    textAlign: 'center',
    fontWeight: 'bold',
    top: 250,
    color: 'black',
  },
});

export default CalendarView;
