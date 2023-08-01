import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Navigation from './src/Navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  const handleSignup = () => {
    setIsLogin(true);
  };

  if (isLogin) {
    return (
      <Navigation />
      /*
              <View style={styles.container}>
                <Text style={styles.title}>로그인 되었습니다.</Text>
                <TouchableOpacity style={styles.button} onPress={() => setIsLogin(false)}>
                  <Text style={styles.buttonText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            */
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.item2}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-7.png')}
      />
      <Image
        style={styles.item}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-8.png')}
      />
      <Image
        style={styles.item1}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-9.png')}
      />
      <Image
        style={styles.item3}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-6.png')}
      />
      <Image
        style={styles.item4}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-5.png')}
      />
      <Image
        style={styles.item5}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/ellipse-10.png')}
      />
      {/*제목*/}
      <Image
        style={styles.title}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/cap1.png')}
      />
      <View style={{bottom: 70}}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={{bottom: 70}}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText1}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button3} onPress={handleLogin}>
          <Image
            style={styles.kakaologo}
            source={require('./src/assets/img/TodoScreen/kakaologo.png')}
          />
          <Text style={styles.buttonText3}>카카오톡으로 시작</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={{padding: 0}}>아직 회원이 아니신가요? </Text>
          <TouchableOpacity style={styles.button2} onPress={handleSignup}>
            <Text style={styles.buttonText2}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*흰색*/}
      <Image
        style={[styles.icon1, styles.iconLayout]}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/-1-1.png')}
      />
      {/*연한 파랑*/}
      <Image
        style={[styles.icon4, styles.iconLayout]}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/-2.png')}
      />
      {/*짙은 파랑*/}
      <Image
        style={[styles.icon3, styles.iconLayout]}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/-5-1.png')}
      />
      {/*노랭이*/}
      <Image
        style={[styles.icon2, styles.iconLayout]}
        resizeMode="cover"
        source={require('./src/assets/img/TodoScreen/-3-1.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconLayout1: {
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  icon: {
    height: '20.73%',
    width: '44.62%',
    top: '75.24%',
    right: '55.38%',
    bottom: '4.03%',
    left: '0%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    top: 148,
    height: 40,
    width: 176,
    position: 'absolute',
  },
  input: {
    width: 280,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  button: {
    backgroundColor: '#1c7892',
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 10,
    width: 210,
    height: 40,
    alignItems: 'center',
  },
  button1: {
    backgroundColor: 'blue',
    borderRadius: 5,
    marginBottom: 10,
  },
  button2: {
    backgroundColor: 'white',
  },
  button3: {
    backgroundColor: '#f9e300',
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 25,
    width: 210,
    height: 40,
    flexDirection: 'row',
  },
  buttonText1: {
    fontSize: 18,
    color: 'white',
  },
  buttonText3: {
    fontSize: 18,
    color: 'black',
  },
  buttonText2: {
    color: '#1c7892',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  groupChildPosition: {
    height: 38,
    width: 244,
    marginLeft: -122,
    left: '50%',
    position: 'absolute',
  },

  item: {
    top: 54,
    left: 41,
    width: 121,
    height: 121,
    position: 'absolute',
  },
  item1: {
    top: 234,
    left: 321,
    width: 61,
    height: 61,
    position: 'absolute',
  },
  item2: {
    top: 26,
    left: 16,
    width: 47,
    height: 47,
    position: 'absolute',
  },
  item3: {
    top: 186,
    left: 356,
    width: 76,
    height: 94,
    position: 'absolute',
  },
  item4: {
    top: 386,
    left: 26,
    width: 37,
    height: 38,
    position: 'absolute',
  },
  item5: {
    top: 396,
    left: 0,
    width: 46,
    height: 64,
    position: 'absolute',
  },
  child: {
    top: 136,
    left: 16,
    width: 7,
    height: 47,
    position: 'absolute',
  },
  icon1: {
    top: 500,
    left: 120,
    width: 190,
    height: 210,
  },
  icon2: {
    top: 665,
    left: 70,
    width: 212,
    height: 180,
  },
  icon3: {
    width: 190,
    height: 284,
    top: 559,
    left: 220,
  },
  icon4: {
    width: 203,
    top: 578,
    left: 0,
    height: 214,
  },
  iconLayout: {
    position: 'absolute',
    overflow: 'hidden',
  },
  kakaologo: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    bottom: 4,
  },
});
