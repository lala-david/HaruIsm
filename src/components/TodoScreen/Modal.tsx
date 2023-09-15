import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TodoScreen from '../TodoScreen/TodoScreen';

export default function Pipo() {
  const [showHome, setShowHome] = useState(false);

  const handleButtonPress = () => {
    setShowHome(true);
  };

  if (showHome) {
    return <TodoScreen />;
  }
  return (
    <ScrollView>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Text style={styles.title}>💡가까운 병원을 찾았어요</Text>
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require('../../assets/img/heart.png')}
        />
        <Text style={styles.midtext}>군산시 정신건강복지센터</Text>
        <View style={styles.butview}>
          <TouchableOpacity
            style={styles.backbutton1}
            onPress={handleButtonPress}>
            {/* 기타 컴포넌트 및 내용 */}
            <Text style={styles.bottext}>돌아가기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backbutton2}
            onPress={handleButtonPress}>
            {/* 기타 컴포넌트 및 내용 */}
            <Text style={styles.bottext}>연락하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'column',
    marginTop: 80,
    marginLeft: 50,
  },
  title: {
    paddingTop: 140,
    fontSize: 30,
    fontWeight: 'bold',
  },
  butview: {
    flexDirection: 'row',
  },
  icon1: {
    margin: 100,
    width: 220,
    height: 220,
  },
  midtext: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    bottom: 40,
  },
  bottext1: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottext: {
    color: 'white',
    width: 60,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backbutton1: {
    backgroundColor: 'red',
    paddingVertical: 16,
    paddingHorizontal: 70,
    borderRadius: 105,
    margin: 20,
    width: 150,
    alignItems: 'center',
  },
  backbutton2: {
    backgroundColor: 'green',
    paddingVertical: 16,
    paddingHorizontal: 70,
    borderRadius: 105,
    margin: 20,
    width: 140,
    alignItems: 'center',
  },
});
