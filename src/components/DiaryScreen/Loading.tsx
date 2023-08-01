import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from 'react-native';

const Loading = () => {
  const [opacity1] = useState(new Animated.Value(0));
  const [opacity2] = useState(new Animated.Value(0));
  const [opacity3] = useState(new Animated.Value(0));
  const [showLoading, setShowLoading] = useState(true);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const animateOpacity = (
      opacity: Animated.Value | Animated.ValueXY,
      delay: number,
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateOpacity(opacity1, 0);
    animateOpacity(opacity2, 100);
    animateOpacity(opacity3, 300);

    setTimeout(() => {
      setShowLoading(false);
      setShowCheck(true);
      setTimeout(() => {}, 1500);
    }, 5000);
  }, [opacity1, opacity2, opacity3]);

  return (
    <View style={styles.container}>
      {showLoading && (
        <Image
          source={require('../../assets/img/draw_loading.gif')}
          style={styles.img}
        />
      )}
      {showCheck && (
        <Image
          source={require('../../assets/img/check.gif')}
          style={styles.img}
        />
      )}
      <View style={styles.loadingText}>
        {showLoading && (
          <>
            <Text
              style={{
                right: 3,
                fontSize: 24,
                fontWeight: 'bold',
                color: 'black',
              }}>
              ✨ 그림 생성중
            </Text>
            <Animated.Text
              style={{
                fontSize: 35,
                opacity: opacity1,
              }}>
              .
            </Animated.Text>
            <Animated.Text
              style={{
                fontSize: 35,
                opacity: opacity2,
              }}>
              .
            </Animated.Text>
            <Animated.Text
              style={{
                fontSize: 35,
                opacity: opacity3,
              }}>
              .
            </Animated.Text>
          </>
        )}
        {showCheck && (
          <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
            생성 완료
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  img: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    resizeMode: 'contain',
    bottom: 50,
  },
  loadingText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 28,
    color: 'black',
    fontWeight: 'bold',
    bottom: 110,
  },
});

export default Loading;
