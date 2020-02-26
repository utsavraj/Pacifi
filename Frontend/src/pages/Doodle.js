import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, Button, Platform, AppState, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import axios from 'react-native-axios';
import { API_URL } from '../config'

const isAndroid = Platform.OS === 'android';
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

export default class Doodle extends Component {
  static navigationOptions = {
    headerTitle: "Doodle" , 
    headerStyle: {
      backgroundColor: '#000000',
      height: APPBAR_HEIGHT,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  };

  constructor(props){
    super(props);
    this.state = {
      starting_text: "DRAW HERE",
      Doodle_timer: 0,
     }
  }

  state = {
    image: null,
    strokeColor: Math.random() * 0xffffff,
    strokeWidth: Math.random() * 30 + 10,
    appState: AppState.currentState,
    
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4() });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
    setTimeout(() => {
      this.setState({starting_text: ""}); }, 600);
      let intervalId = setInterval(() => {
      this.setState({Doodle_timer: this.state.Doodle_timer + 1}); }, 1000);
      this.setState({ intervalId: intervalId })

  }


  async componentWillUnmount() {
    //Saving the time for doodling
    var tok = await AsyncStorage.getItem('token');
    var time = this.state.Doodle_timer
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    //saving breathing time in database
    axios.post(`${API_URL}/chat/saveDoodlingTime/`,
            {minutes: minutes, seconds: seconds, owner: this.props.username},
            {headers: {
                Authorization: `JWT ${tok}`,
                'Content-Type': 'application/json'
            }},
            )
            .then(async (response) => {
                if(response.data.stat === "success"){
                    console.log("Breathing Time Successfully Saved!");
                }
                else{
                    alert("Failed to save the breathing time!");
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    clearInterval(this.state.intervalId)
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);

  }

  onChangeAsync = async () => {
    const { uri } = await this.sketch.takeSnapshotAsync();

    this.setState({
      image: { uri },
      strokeWidth: Math.random() * 30 + 10,
      strokeColor: Math.random() * 0xffffff,
    });
  };

  onReady = () => {
    console.log('ready!');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.sketchContainer}>
          <Text style = {{color: '#7a757c',fontWeight: 'bold', fontSize: 45, textAlign: 'center' }}> {this.state.starting_text}</Text>
            <ExpoPixi.Sketch
              ref={ref => (this.sketch = ref)}
              style={styles.sketch}
              strokeColor={this.state.strokeColor}
              strokeWidth={this.state.strokeWidth}
              strokeAlpha={1}
              onChange={this.onChangeAsync}
              onReady={this.onReady}
            />
          </View>
        </View>
        <AwesomeButton
      progress
      backgroundColor	= '#1b03a3'
      width = {400}
      alignSelf= 'stretch'
      onPress={next => {
        next();
        this.sketch.undo();;
        
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> UNDO </Text>  
    </AwesomeButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"

  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '100%',
  },
  image: {
    flex: 1,
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
});