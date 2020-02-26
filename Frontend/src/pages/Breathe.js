import React, { Component,  useState, useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar, AsyncStorage, TouchableOpacity, Animated, Image, Easing, Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'react-native-axios';
import { API_URL } from '../config'

APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

export default class Breathe extends Component {

  static navigationOptions = {
    headerTitle: "Breathe" , 
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

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1),
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false,
      text: "Press Start",
      refreshIntervalId: 0,
    }
  }
  
  componentDidMount() {
    clearInterval(this.state.timer);
    clearInterval(this.state.text);
  }

  onButtonStart = () => {

    let timer = setInterval(() => {

      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;

      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = '00';
      }

      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num
      });
    }, 1000);
    this.setState({ timer });

    this.setState({startDisable : true})

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 2500,
          ease: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 2500,
          ease: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
 

  temp = 0;
  this.setState({text: "Breathe In"});
  refreshIntervalId = setInterval(() => {
    
    if (temp %2 ==0 ) {
      this.setState({text: "Breathe In"});
      temp++;
    }
    else {
      this.setState({text: "Breathe Out"});
      temp++
    }
  }, 2500);

  
  
  
}


  onButtonClear = async () => {
    clearInterval(this.state.timer);
    this.setState({startDisable : false});

    var tok = await AsyncStorage.getItem('token');
    //saving breathing time in database
    axios.post(`${API_URL}/chat/saveBreatheTime/`,
            {minutes: this.state.minutes_Counter, seconds: this.state.seconds_Counter, owner: this.props.username},
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

    this.setState({
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.opacity, {
          toValue: 1,
          ease: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
    
    try {
    clearInterval(refreshIntervalId,this.setState({text: "Press Start"}) );
    }
    catch(err) {
      this.setState({text: "Press Start"});
    }
  }
  
  render() {
    
    return (
      <View style={styles.container} >
      <Animated.View style={{opacity: this.state.opacity}}>
         <Image 
        style={{width: 350, height: 350}}
        source={require('../assets/images/Breathing_Circle.png')} />
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.Text style={[styles.counterText]}>
                    {this.state.text}
                </Animated.Text>
</View>
</Animated.View>
<View style={{alignItems: 'center', padding: '2%'}}>  
<Text style={[styles.counterText2]}>BREATHING FOR:</Text>
<Text style={styles.counterText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>

</View>
<View style={{flexDirection: 'row' , padding:'0%'}}>
<TouchableOpacity
            onPress={this.onButtonStart}
            activeOpacity={0.6}
            style={[styles.button, { backgroundColor: this.state.startDisable ? '#B0BEC5' : '#47c742' }]} 
            disabled={this.state.startDisable} >

            <Text style={[styles.buttonText, { fontWeight:'bold' }]}>START</Text>
            </TouchableOpacity>

          <TouchableOpacity
            onPress={this.onButtonClear}
            activeOpacity={0.6}
            style={[styles.button, { backgroundColor:'#d62f2f' }]} >

            <Text style={[styles.buttonText, { fontWeight:'bold' }]}> CLEAR </Text>

          </TouchableOpacity>
          </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000000',
    flexDirection: 'column',
  },
  image: {
    justifyContent:'center',
    backgroundColor:'transparent'
  },
  SubContainer: {
    flexDirection: 'row',
    height: '15%'
  },
  button: {
    width: '25%',
    paddingTop:'8%',
    paddingBottom:8,
    borderRadius:7,
    marginTop: 10,
    marginRight: 5,
  },
  buttonText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 20,
      justifyContent: 'center',
  },
  counterText:{
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  counterText2:{
    fontSize: 14,
    color: '#7a757c',
    justifyContent: 'center',
  }
});
