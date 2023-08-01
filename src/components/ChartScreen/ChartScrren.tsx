import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {VictoryPie} from 'victory-native';
import {Screen} from 'react-native-screens';

const data = [
  {x: '보통', y: 30, fill: '#ECE7D9'},
  {x: '좋음', y: 20, fill: '#8ACEDF'},
  {x: '슬픔', y: 15, fill: '#1C7892'},
  {x: '화남', y: 35, fill: '#F7CB7F'},
];

export default function ChartWithLegend() {
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: '#f4f4f4',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Text
          style={{
            fontSize: 20,

            color: 'black',
            right: 140,
            top: 60,
          }}>
          감정 통계
        </Text>
        <Text
          style={{
            right: 90,
            top: 70,
          }}>
          이번달의 감정을 확인해 보세요
        </Text>
        <View style={styles.calender}>
          <Text>날짜영역</Text>
        </View>
        <View style={styles.chart}>
          <VictoryPie
            width={180}
            height={260}
            data={data}
            innerRadius={90}
            labelRadius={50}
            colorScale={['#ECE7D9', '#8ACEDF', '#1C7892', '#F7CB7F']}
            labels={({datum}) => `${datum.y}%`}
            style={{
              labels: {
                fontWeight: 'bold',
                fontSize: 15,
                fill: 'black',
              },
            }}
          />
          <View style={styles.legendContainer}>
            {data.map(item => (
              <View key={item.x} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, {backgroundColor: item.fill}]}
                />
                <Text style={styles.legendLabel}>{item.x}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottombox}>
          <Text
            style={{
              color: 'black',
              fontSize: 17,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              paddingTop: 20,
              paddingLeft: 30,
            }}>
            이달의 퀘스트!
          </Text>
          <Text
            style={{
              alignSelf: 'flex-start',
              paddingTop: 10,
              paddingLeft: 30,
            }}>
            퀘스트를 이만큼 완료했어요
          </Text>
          <View style={styles.Qbox}>
            <Text style={[styles.Qboxitem, {backgroundColor: '#8ACEDF'}]}>
              {'\n'}TODO
              <Text style={{fontSize: 25}}>{'\n\n'}222</Text>
            </Text>
            <Text style={[styles.Qboxitem, {backgroundColor: '#ECE7D9'}]}>
              {'\n'}WRITE
              <Text style={{fontSize: 25}}>{'\n\n'}222</Text>
            </Text>
            <Text style={[styles.Qboxitem, {backgroundColor: '#F7CB7F'}]}>
              {'\n'}PHOTO
              <Text style={{fontSize: 25}}>{'\n\n'}222</Text>
            </Text>
          </View>
          <Text>{'\n'}이번달은 일기를 가장 많이 썼네요!</Text>
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
  },
  legendLabel: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  chart: {
    flexDirection: 'row',
    marginTop: 70,
  },
  bottombox: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    width: 400,
    height: 500,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  Qbox: {
    flexDirection: 'row',
  },
  Qboxitem: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    borderRadius: 20,
    width: 80,
    height: 120,
    margin: 20,
    overflow: 'hidden',
  },
  calender: {
    top: 90,
    paddingTop: 10,
    paddingBottom: 30,
  },
});
