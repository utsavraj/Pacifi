import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, AsyncStorage} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import axios from 'react-native-axios';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Actions} from 'react-native-router-flux';
import { dialogflowConfig } from './env';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { API_URL } from '../config'


const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar: 'https://i.imgur.com/7k12EPD.png'
};

const initialMessage = [
  "What brings you here?","What is the problem from your viewpoint? ","What is your main concern today?"
];

APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});


class Buddy extends Component {

  static navigationOptions = {
    headerTitle: "Buddy" , 
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
  
  state = {
    messages: [
      {
        _id: 1,
        text: `Hi! I am your buddy 🤖 from Pacify.\n\n`+initialMessage[Math.floor(Math.random() * 3)],
        createdAt: new Date(),
        user: BOT_USER
      }
    ],
    switchValue: false ,
    hasCameraPermission: null, //Permission value
    type: Camera.Constants.Type.front, //specifying app start with front camera.
  };

  async componentWillMount() {
    //Getting Permission result from app details.
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
    // this.getChat();
  }

  async handleLogout() {
    await AsyncStorage.removeItem('token');
    // this.setState({ isLoggedIn: false, isCreateAccount: false, UserName: "", Password: "", authError: "" });
    Actions.reset('login');
  }

//   getChat() {
//     axios.post('https://f9250637.ngrok.io/chat/getChat/', {user: "utsav"})
//     .then((response) => {
//         if(response.data.stat === "success"){
//             console.log("Successfully Retrieved!");
//             const USER = {
//                 _id: 1,
//                 name: 'Utsav',
//                 avatar: 'https://i.imgur.com/7k12EPD.pnghttps://randomuser.me/api/portraits/men/32.jpg'
//               };
//             var chat = [];
//             var messages = response.data.messages;
//             var count = 0;
//             messages.map((message) => {
//                 var content = message.content;
//                 var createdAt = message.createdAt;
//                 var user;
//                 if(message.owner === "sheheryar")  user = BOT_USER;
//                 else{
//                     user = USER
//                 }
//                 let msg = {
//                     _id: count,
//                     content,
//                     createdAt: createdAt,
//                     user: user
//                   };
//                   chat.push(msg)
//                   count +=1;
//             });
            
//             this.setState(previousState => ({
//                 messages: GiftedChat.append(chat)
//             }));
//           }
//           else{
//               console.log("Failed to retrieve chat!");
//           }
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
//   }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  async onSend(messages = []) {
    console.log(messages[0]);
    var tok = await AsyncStorage.getItem('token');
    axios.post(`${API_URL}/chat/receiveMessages/`,
    {message: messages[0].text, date: new Date(), owner: this.props.username, receiver: "sheheryar"},
    { headers: {Authorization: `JWT ${tok}`} })
    .then((response) => {
        if(response.data.stat === "success"){
            console.log("Successfully Saved!");
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, messages)
              }));
          
              let message = messages[0].text;
              Dialogflow_V2.requestQuery(
                message,
                result => this.handleGoogleResponse(result),
                error => console.log(error)
              );
          }
          else{
              console.log("Failed to save successfully!");
          }
    })
    .catch(function (error) {
        console.log(error);
    });
    
  }

  async sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER
    };
    var tok = await AsyncStorage.getItem('token');

    axios.post(`${API_URL}/chat/receiveMessages/`,
    {message: text, date: new Date(), receiver: this.props.username, owner: "sheheryar"},
    { headers: {Authorization: `JWT ${tok}`} }
    )
    .then((response) => {
        if(response.data.stat === "success"){
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, [msg])
            }));
          }
          else{
              console.log("Bot message failed to save successfully!");
          }
    })
    .catch(function (error) {
        console.log(error);
    });
    
  }

  snap = async () => {

    console.log("snap called!");
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      let filename = photo.uri.split('/').pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      formData.append('photo', { uri: photo.uri, name: filename, type });
      var tok = await AsyncStorage.getItem('token');
      let response = await fetch(`${API_URL}/chat/processImage/`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `JWT ${tok}`,
          'content-type': 'multipart/form-data',
        },
      });
    }

  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === false || hasCameraPermission === null) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity onPress={this.handleLogout}><Text style={styles.logoutButton}>Logout</Text></TouchableOpacity>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1
            }}
          />
  
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
        </View>
      );
    }
    else{
      return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={{ position: "relative", flex:1, backgroundColor: 'red'}}>
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => {this.onSend(messages);this.snap()}}
              user={{
                _id: 1
              }}

            />
            {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
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
}

const styles = StyleSheet.create({
    logoutButton: {
        color: '#12799f',
        fontSize:16,
        fontWeight: '500',
    },
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
    }
});

export default Buddy;