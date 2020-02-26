import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard, Image,  Platform } from 'react-native';

import {Actions} from 'react-native-router-flux';

import Form from '../components/Form';

const APPBAR_HEIGHT = Platform.select({
    ios: 44,
    android: 44,
    default: 64,
  });

export default class Login extends Component {
    static navigationOptions = {
        headerTitle: "Login" , 
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
    signup() {
        Actions.signup()
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>{'\n'}</Text>
                <Text>{'\n'}</Text>
                <Image
          style={{width: 100, height: 100}}
          source={require('../assets/images/icon.png')} />
                <Form type="Login"/>
                <View style={styles.signupTextCont}> 
                    <Text style={styles.signupText}>Dont have an account yet? </Text>
                    <TouchableOpacity onPress={this.signup} style={styles.button} ><Text style={styles.signupButton}>Signup</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    signupTextCont: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingVertical: 16,
      flexDirection: 'row',
    },
    signupText: {
      color: '#1DB954', 
      fontSize:16,
    },
    signupButton: {
        color: '#1DB954',
        fontSize:16,
        fontWeight: '700',
    }
});