import React, { Component } from 'react'; 
import { Pedometer } from "expo-sensors";
import { 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    View,
    Text, 
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    AsyncStorage
    } from 'react-native'; 

import * as WebBrowser from 'expo-web-browser';
import axios from 'react-native-axios';
import { API_URL } from '../config'

APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

const MAX_RESULT = 20; 
const PLAYLIST_ID = "PL4QNnZJr8sRNzSeygGocsBK9rVXhwy9W4"; 
const API_KEY = "AIzaSyD86oVuDKqNJslXIDIvfKOypQyOA1JYqxU"; 

export default class CalmMusic extends Component {

  static navigationOptions = {
    headerTitle: "Jog" , 
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
    componentWillMount() {
      this.fetchPlaylistData();
      this._subscribe();
    }

    MusicTitle(num, title) {
      let song_title = String(title.title)
      let song_title_titles = song_title.split("-");
      return song_title_titles[num]
  }
    componentWillUnmount() {
      this._unsubscribe();
    }
    _subscribe = () => {
      this._subscription = Pedometer.watchStepCount(result => {
        this.setState({
          currentStepCount: result.steps
        });
      });
  
      Pedometer.isAvailableAsync().then(
        result => {
          this.setState({
            isPedometerAvailable: String(result)
          });
        },
        error => {
          this.setState({
            isPedometerAvailable: "Could not get isPedometerAvailable: " + error
          });
        }
      );

      const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = async () => {
    //Saving the time for doodling
    var tok = await AsyncStorage.getItem('token');
    //saving breathing time in database
    axios.post(`${API_URL}/chat/saveJoggingSteps/`,
            {steps: this.state.currentStepCount, owner: this.props.username},
            {headers: {
                Authorization: `JWT ${tok}`,
                'Content-Type': 'application/json'
            }},
            )
            .then(async (response) => {
                if(response.data.stat === "success"){
                    console.log("Steps Time Successfully Saved!");
                }
                else{
                    alert("Failed to save the number of steps!");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };
  
    fetchPlaylistData = async () => {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${PLAYLIST_ID}&maxResults=${MAX_RESULT}&part=snippet%2CcontentDetails&key=${API_KEY}`);
      const json = await response.json();
      this.setState({ videos: json['items']});
      console.log(this.state.videos)
    };
    constructor(props) {
      super(props);
      this.state = {
        videos: [],
        isPedometerAvailable: "checking",
        pastStepCount: 0,
        currentStepCount: 0,
        music_title: 0,
        music_subtitile: 1,
      }
    }

    state={
      showWebView: false
    }

    render() {
      const videos = this.state.videos;
      return (
        <SafeAreaView style={styles.safeArea}>
              <FlatList
                data={this.state.videos}
                keyExtractor={(_, index) => index.toString()}
                renderItem={
                  ({item}) => 
                  <TouchableOpacity
                      style={styles.demacate}
                      onPress={() => WebBrowser.openBrowserAsync('https://www.youtube.com/watch?v=' + item.contentDetails.videoId + '?rel=0&amp;autoplay=1;fs=0;autohide=0;hd=0;')
                       }
                      
                  >
                  <View style={styles.container }> 
                  <Image
          style={{width: 160, height: 90 }}
          source={{uri: 'https://img.youtube.com/vi/' + item.contentDetails.videoId + '/0.jpg'}}
        /> 
        <View style={{justifyContent: 'center'}}>
        <Text style = {styles.item_title  }>
                    {this.MusicTitle(1, item.snippet)}  </Text>
                    <Text style = {styles.item_subtitle } > {this.MusicTitle(0, item.snippet)} </Text>
                    </View>
                    </View>
                  </TouchableOpacity>
                }
              />
              <TouchableOpacity style={styles.box}>
              <Text style = {styles.counterText2}>STEP COUNT</Text>
        <Text style={styles.counterText}>{this.state.currentStepCount}</Text>
        </TouchableOpacity>

        </SafeAreaView>
        
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
  },
    safeArea: {
      flex: 1,
      backgroundColor: '#000'
    },
    demacate: {
      borderBottomColor: 'green',
      borderBottomWidth: 4,
      backgroundColor: '#000000',
    },
    item: {
      padding: 10,
      fontSize: 12,
      color: '#fff',
      fontWeight: 'bold',
      
    },
    item_title: {
      padding: 10,
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
      flex: 1, 
      flexWrap: 'wrap',
      
    },
    item_subtitle: {
      padding: 10,
      fontSize: 14,
      color: '#fff',
      flex: 1, 
      flexWrap: 'wrap',
      
    },
    box: {
        padding: 20,
        borderRadius: 50
        },
    counterText2:{
      fontSize: 14,
      color: 'green',
      justifyContent: 'center',
      textAlign: 'center',
    },
    counterText:{
      fontSize: 40,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });