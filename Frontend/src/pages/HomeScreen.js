import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import ProgressCircle from 'react-native-progress-circle'
import axios from 'react-native-axios';
import { API_URL } from '../config'


//change 
var quotes = 
[
  '"Life itself is the most wonderful fairy tale." – Hans Christian Andersen',
   '“It doesn’t matter how slow you go, as long as you don’t stop.” – Confucius', 
   '“Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day, saying, “I will try again tomorrow.” – Mary Anne Radmacher',
   '“One thing at a time. Most important thing first. Start now.” – Caroline Webb',
  '“Problems are not stop signs; they are guidelines.”– Robert Schuller',
  '“We must embrace pain and burn it as fuel for our journey.” – Kenji Miyazawa',
  '“The gem cannot be polished without friction, nor man perfected without trials.” – Chinese Proverb',
  '“And if today all you did was hold yourself together, We’re proud of you.” - Pacifî Team',
  '“Every day may not be good… but there is something good in every day.”  – Alice Morse Earl',
  '"Once you choose hope, anything is possible." — Christopher Reeve'
];

class LogoTitle extends React.Component {
  render() {
    return (  
      <Image
        source={require('../assets/images/icon.png')}
        style={{ width: 30, height: 30 }} /> 
    );
  }
}

APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

function getRandomArbitrary() {
  return Math.floor(Math.random() * 9) ;
}

export default class HomeScreen extends Component{

  static navigationOptions = {
    headerTitle: () => <LogoTitle /> , 
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
    quote: quotes[getRandomArbitrary()],
    switchValue: false ,
    hasCameraPermission: null, //Permission value
    type: Camera.Constants.Type.front, //specifying app start with front camera.
    red: 40,
    blue: 40,
    green: 40
   }
}

componentWillUnmount() {
  this.willFocusSubscription.remove();
}

async componentWillMount() {
  //Getting Permission result from app details.
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.setState({ hasCameraPermission: status === 'granted' });
  console.log("Comp will mount");
}

componentDidMount() {
  console.log("Wheel loaded!!")
  setInterval(() => {
  this.setState({quote: quotes[getRandomArbitrary()]}); }, 6000);
    setTimeout(async () => {
      await this.snap();
      console.log("Inside!")
    }, 2000);
  
  this.willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.snap();
    }
  );
}

snap = async () => {
  
  console.log("Snap called!");
  if (this.camera) {
    console.disableYellowBox = true;
    let photo = await this.camera.takePictureAsync();
    
    let filename = photo.uri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append('photo', { uri: photo.uri, name: filename, type });
    formData.append("owner", this.props.username);
    var tok = await AsyncStorage.getItem('token');
    fetch(`${API_URL}/chat/stresswheel/`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `JWT ${tok}`,
        'content-type': 'multipart/form-data',
      },
    })
    .then(res => res.json())
      .then(json => {
        this.setState({
          red:parseInt(json.anger),
          blue:parseInt(json.sadness),
          green:parseInt(json.happiness)
        });
      });
  }
  else{
    console.log("camera is not working!")
  }

};

  render () {
  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
    <View style={{ position: "relative", flex:1, backgroundColor: '#000'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
          <Text style={styles.getStartedText2}>
            {this.state.quote} </Text>
            <Text style={styles.getStartedText3}>
            EMOTION WHEEL
          </Text> 
          <Text style={styles.getStartedText}>
            Press the START button to continue
          </Text> 
        <View style={styles.welcomeContainer}>
        {/* <ProgressCircle
            percent={30} //Use the AI value here - this is the Yellow circle
            radius={180}
            borderWidth={28}
            color="#FFFF00"
            shadowColor="#333311"
            bgColor="#000"
        > */}
      <ProgressCircle
            percent={this.state.red} //Use the AI value here - this is the red circle
            radius={150}
            borderWidth={28}
            color="#d73240"
            shadowColor="#2b0a0d"
            bgColor="#000"
        >
            <ProgressCircle
            percent={this.state.green} //Use the AI value here - this is the green circle
            radius={120}
            borderWidth={28}
            color="#97d142"
            shadowColor="#243110"
            bgColor="#000"
        >
            <ProgressCircle
            percent={this.state.blue} //Use the AI value here - this is the blue circle
            radius={90}
            borderWidth={28}
            color="#56b8c1"
            shadowColor="#13292b"
            bgColor="#000"
        >
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
              activeOpacity={1}
              onPress={()=> Actions.Activity({username: this.props.username})} >
          <Image 
        style={{width: 50, height: 50, }}
        source={require('../assets/images/HomeIcon.png')} />
        </TouchableOpacity>
          </View>
        </ProgressCircle>
        </ProgressCircle>
        </ProgressCircle> 
        {/* </ProgressCircle>  */}
        </View>

        <View style={styles.getStartedContainer}>
        <Text style={styles.developmentModeText}>
        We value our customer's privacy so no data is stored in this app or shared with third parties. </Text>
        </View>
      </ScrollView>
      </View>
          <View style={{ position: "absolute", opacity: 0.0}}>
            <Camera ref={ref => { this.camera = ref; }} style={styles.camera} type={this.state.type} />
            <TouchableOpacity
              style={styles.cameraButtons}
              onPress={this.snap}
              disabled={false}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: "white" }}
              >
                Capture
              </Text>
            </TouchableOpacity>
          </View>
    </View>
  );
}
}


function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  cameraview: {
    height: 400,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    height: "90%",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  cameraButtons: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    opacity: 0.0
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  developmentModeText: {
    marginBottom: 20,
    color: '#7a757c',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 12,
    color: '#7a757c',
    lineHeight: 24,
    textAlign: 'center',
    // paddingVertical: 12,
    // paddingHorizontal: 12,
  },
  getStartedText2: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  getStartedText3: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 0,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
