import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types/types';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/core';
type GalleryProps = {
  route: RouteProp<RootStackParamList, 'Gallery'>;
};

interface ImageItem {
  id: number;
  data: string;
}
export const eventEmitter = DeviceEventEmitter;

const Gallery: React.FC<GalleryProps> = ({route}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const selectedDateTag = route.params.tag;

  const handleDeleteImage = async (image: ImageItem) => {
    console.log(`Image ${image.id} deleted.`);

    // 이미지 데이터 완전히 삭제
    await AsyncStorage.removeItem(`image-${selectedDateTag}-${image.id}`);

    // 현재 이미지 목록에서 삭제된 이미지를 제외한 목록을 얻고, 상태 업데이트
    const newImages = images.filter(img => img.id !== image.id);
    setImages(newImages);
  };

  useFocusEffect(
    useCallback(() => {
      const loadImages = async () => {
        const loadedImages = [];
        for (let i = 1; i <= 20; i++) {
          const image = await AsyncStorage.getItem(
            `image-${selectedDateTag}-${i}`,
          );
          if (image) {
            loadedImages.push({id: i, data: image});
          }
        }
        setImages(loadedImages);
      };

      loadImages();

      const handleImageChanged = (tag: string) => {
        if (tag === selectedDateTag) {
          loadImages();
        }
      };

      eventEmitter.addListener('imageChanged', handleImageChanged);

      return () => {
        eventEmitter.removeAllListeners('imageChanged');
      };
    }, [selectedDateTag]),
  );

  const handleImageDoublePress = async (image: ImageItem) => {
    console.log(`Image ${image.id} double clicked.`);

    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    await AsyncStorage.setItem(`${dateString}-image`, image.data);
    eventEmitter.emit('imageChanged', dateString);
  };

  let lastImageClicked: {id: number; time: Date} | null = null;
  const handleClick = (image: ImageItem) => {
    const now = new Date();
    if (
      lastImageClicked &&
      image.id === lastImageClicked.id &&
      now.valueOf() - lastImageClicked.time.valueOf() < 300
    ) {
      handleImageDoublePress(image);
    }
    lastImageClicked = {id: image.id, time: now};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 오늘의 그림 </Text>
      <ScrollView contentContainerStyle={styles.imageScroll}>
        {images.map(image => (
          <View key={image.id} style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => handleClick(image)}>
              <ImageBackground
                source={require('../../assets/img/film.png')}
                style={styles.imageContainer}>
                <Image
                  source={{uri: `data:image/png;base64,${image.data}`}}
                  style={styles.image}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteImage(image)}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>❌</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    alignItems: 'center',
    fontSize: 22,
    top: 10,
    marginBottom: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  imageScroll: {
    paddingHorizontal: 8,
  },
  imageContainer: {
    width: 250,
    height: 240,
    resizeMode: 'contain',
  },
  image: {
    top: 10,
    width: 190,
    left: 30,
    height: 190,
    resizeMode: 'contain',
    marginVertical: 10,
    borderRadius: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
});

export default Gallery;
