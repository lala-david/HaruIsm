import React, {useState} from 'react';
import {
  ScrollView,
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ko'; // 한글 로캘 추가
import Pipo from './Modal';
import 'react-native-gesture-handler';

export default function App() {
  const [currentDate, setCurrentDate] = useState(moment());

  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [editingTodoText, setEditingTodoText] = useState('');

  const handlePrevWeek = () => {
    setCurrentDate(moment(currentDate).subtract(7, 'days'));
  };

  const handleNextWeek = () => {
    setCurrentDate(moment(currentDate).add(7, 'days'));
  };
  const animateOpacity = (
    opacity: Animated.Value | Animated.ValueXY,
    delay = 0,
  ) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 700,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const opacity1 = new Animated.Value(1);
  const opacity2 = new Animated.Value(1);
  const opacity3 = new Animated.Value(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLogin(true);
      setIsLoading(false);
    }, 2000);
  };
  const handleSignup = () => {
    setIsLogin(true);
  };

  if (isLoading) {
    animateOpacity(opacity1, 0);
    animateOpacity(opacity2, 100);
    animateOpacity(opacity3, 300);

    return (
      <View style={styles.ccontainer}>
        <Image
          source={require('../../assets/img/loading.gif')}
          style={styles.image}
        />
        <Text style={styles.loginText}>도움을 찾고있어요</Text>
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.text, {opacity: opacity1}]}>
            .
          </Animated.Text>
          <Animated.Text style={[styles.text, {opacity: opacity2}]}>
            .
          </Animated.Text>
          <Animated.Text style={[styles.text, {opacity: opacity3}]}>
            .
          </Animated.Text>
        </View>
      </View>
    );
  }
  if (isLogin) {
    return <Pipo />;
  }

  const deleteItem = () => {
    Alert.alert(
      '❗️위험이 감지되었어요',
      '도움이 필요하신가요?',
      [
        {text: '예', onPress: () => {}, style: 'cancel'},
        {
          text: '아니오',
          onPress: () => {},
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  };

  const addTodo = () => {
    if (todoText.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        date: currentDate.format('YYYY-MM-DD'),
        text: todoText,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTodoText('');
      setShowTextInput(false);
    }
  };

  const editTodo = (id, newText) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, text: newText};
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditingTodoId('');
    setEditingTodoText('');
  };

  const deleteTodo = id => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleTodo = id => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, completed: !todo.completed};
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const renderCalendarItem = date => {
    const isActive = date.isSame(currentDate, 'day');
    const isPast = date.isBefore(moment(), 'day');
    const hasTodo = todos.some(todo => todo.date === date.format('YYYY-MM-DD'));

    const calendarItemStyles = [
      styles.calendarItem,
      isActive && styles.activeCalendarItem,
      isPast && styles.pastCalendarItem,
      hasTodo && styles.hasTodo,
    ];

    return (
      <TouchableOpacity
        key={date.format('YYYY-MM-DD')}
        style={calendarItemStyles}
        onPress={() => setCurrentDate(date)}>
        <Text style={styles.calendarItemText}>{date.format('D')}</Text>
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const weekStart = moment(currentDate).startOf('week');
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const calendarItems = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(weekStart).add(i, 'days');
      const dayOfWeek = daysOfWeek[i];
      calendarItems.push(
        <View key={date.format('YYYY-MM-DD')} style={styles.calendarItem}>
          <Text style={styles.Day_week}>{dayOfWeek}</Text>
          <TouchableOpacity
            style={[
              styles.dateContainer,
              date.isSame(currentDate, 'day') && styles.activeDateContainer,
              todos.some(todo => todo.date === date.format('YYYY-MM-DD')) &&
                styles.hasTodoDateContainer,
            ]}
            onPress={() => setCurrentDate(date)}>
            <Text
              style={[
                styles.dateText,
                date.isSame(currentDate, 'day') && styles.activeDateText,
              ]}>
              {date.format('D')}
            </Text>
          </TouchableOpacity>
        </View>,
      );
    }

    return <View style={styles.calendar}>{calendarItems}</View>;
  };

  const renderTodos = () => {
    const filteredTodos = todos.filter(
      todo => todo.date === currentDate.format('YYYY-MM-DD'),
    );

    return filteredTodos.map(todo => {
      if (editingTodoId === todo.id) {
        return (
          <View key={todo.id} style={styles.todoItem}>
            <TextInput
              style={styles.editInput2}
              value={editingTodoText}
              onChangeText={text => setEditingTodoText(text)}
              autoFocus
              onBlur={() => {
                editTodo(todo.id, editingTodoText); // 수정된 editingTodoText를 사용하여 editTodo 호출
                setEditingTodoId('');
                setEditingTodoText('');
              }}
            />
            <TouchableOpacity
              onPress={() => {
                editTodo(todo.id, editingTodoText); // 수정된 editingTodoText를 사용하여 editTodo 호출
                setEditingTodoId('');
                setEditingTodoText('');
              }}>
              <Text style={styles.save_text}>저장</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View key={todo.id} style={styles.todoItem}>
          <TouchableOpacity onPress={() => toggleTodo(todo.id)}>
            {/* 체크박스 표시 */}
            <View style={styles.checkbox}>
              {todo.completed && <View style={styles.checkmark} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditingTodoId(todo.id);
              setEditingTodoText(todo.text); // 현재 todo의 텍스트로 editingTodoText 설정
            }}>
            <Text
              style={todo.completed ? styles.completedText : styles.todoText}>
              {todo.text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
            <View style={styles.delview}>
              <Text style={styles.deltext}>삭제</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const renderAddTodoTextInput = () => {
    if (!showTextInput) {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTextInput(true)}>
          <Text style={styles.addButtonText}>할일 등록</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.todoItem}>
        <TextInput
          style={styles.editInput}
          placeholder="Enter a todo"
          value={todoText}
          onChangeText={text => setTodoText(text)}
          autoFocus
        />
        <TouchableOpacity style={styles.addButton2} onPress={addTodo}>
          <Text style={styles.addButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevWeek}>
            <Text style={styles.left_month_button}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.month}>
            {currentDate.format('YYYY')}년 {currentDate.format('MMMM')}
          </Text>
          <TouchableOpacity onPress={handleNextWeek}>
            <Text style={styles.rigit_month_button}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        {renderCalendar()}
        {renderAddTodoTextInput()}
        <View style={styles.todoList}>{renderTodos()}</View>
        <Image
          style={styles.icon1}
          resizeMode="cover"
          source={require('../../assets/img/TodoScreen/a1.png')}
        />
        <TouchableOpacity onPress={handleLogin}>
          <Image
            style={styles.icon2}
            source={require('../../assets/img/em.gif')}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  month: {
    right: 130,
    paddingTop: 30,
    fontSize: 20,
  },
  todo: {
    color: 'black',
    fontSize: 18,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeCalendarItem: {
    borderBottomColor: 'blue',
  },
  pastCalendarItem: {
    opacity: 0.5,
  },
  hasTodo: {
    backgroundColor: 'lightblue',
  },
  calendarItemText: {
    fontSize: 16,
  },
  input: {
    height: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 105,
    marginBottom: 10,
    bottom: 10,
    left: 10,
    width: 330,
  },
  addButton2: {
    backgroundColor: '#9cd6e5',
    paddingVertical: 10,
    paddingHorizontal: 23,
    borderRadius: 105,
    marginBottom: 10,
    bottom: 25,
    right: 15,
  },
  addButtonText: {
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  todoList: {
    bottom: 5,
    elevation: 20,
    backgroundColor: '#fff',
    width: 350,
    height: 380,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  todoItem: {
    top: 20,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  editInput: {
    right: 20,
    bottom: 30,
    height: 35,
    width: 270,
    flex: 0,
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  editInput2: {
    height: 35,
    width: 270,
    flex: 0,
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
  },
  completedText: {
    flex: 1,
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  hasTodoDateContainer: {
    borderRadius: 100,
    width: 40,
    backgroundColor: '#9cd6e5',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#F7CB7F',
  },
  dateContainer: {
    top: 5,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeDateContainer: {
    borderRadius: 100,
    width: 40,
    backgroundColor: '#1c7892',
  },
  activeDateText: {
    fontWeight: 'bold',
    color: 'white',
  },
  rigit_month_button: {
    top: 17,
    right: 20,
    fontWeight: 'bold',
  },
  left_month_button: {
    top: 17,
    left: 300,
    fontWeight: 'bold',
  },
  deltext: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  delview: {
    left: 10,
  },
  icon1: {
    top: 10,
    left: 125,
    width: 120,
    height: 161,
  },
  icon2: {
    width: 40,
    height: 35,
    bottom: 135,
    left: 234,
  },
  save_text: {
    marginLeft: 10,
  },
  Day_week: {
    color: '#1C7892',
  },
  pipo: {
    width: 80,
    height: 80,
    right: 50,
    top: -10,
    position: 'absolute',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  ccontainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 24,
    bottom: 85,
    color: 'black',
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    marginHorizontal: 5,
    bottom: 111,
    left: 77,
    color: 'black',
    fontWeight: 'bold',
  },
});
