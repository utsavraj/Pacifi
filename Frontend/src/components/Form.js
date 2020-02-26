import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard } from 'react-native';
import axios from 'react-native-axios';
import {Actions} from 'react-native-router-flux';
import { API_URL } from '../config'

export default class Form extends Component {

    constructor(props){
        super(props);
        this.state={
            email:'',
            password: '',
            username: ''
        }
    }

    checkReturningUser= async()=>{
        var tok = await AsyncStorage.getItem('token');
        console.log(tok);
        if(tok!==null){
            axios.get(`${API_URL}/authentication/current_user/`,
            { withCredentials: true, headers: {Authorization: `JWT ${tok}`} }
            )
                .then((response) => {
                    if(response.data.username){
                        console.log("Inside user details");
                        this.setState({ 
                            username: response.data.username
                        });
                        this.login({username:this.state.username})
                    }
                    else{
                        alert("Failed to fetch token from local storage!");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    componentDidMount() {
        this.checkReturningUser();
    }

    removePreviousChat= async(user)=>{
        console.log(user);
        var tok = await AsyncStorage.getItem('token');
        console.log("done!");
        axios.post(`${API_URL}/chat/clearChat/`, 
        {user: user.username},
        { withCredentials: true, headers: {Authorization: `JWT ${tok}`, 'Content-Type': 'application/json'} })
        .then((response) => {
            if(response.data.stat === "success"){
                console.log("Chats Successfully Deleted!");
            }
            else{
                console.log("Failed to delete chat!");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    login(userDetails){
        this.removePreviousChat(userDetails);
        Actions.HomeScreen(userDetails);
    }

    saveData =async()=>{
        const {email, password, username} = this.state;

        //save data with asyncstorage
        let loginDetails={
            email: email,
            password: password,
            username: username
        }

        if(this.props.type === 'Signup')
        {
            axios.post(`${API_URL}/authentication/users/`, loginDetails)
            .then(async (response) => {
                if(response.data.token){
                    console.log("Successfully Saved!");
                    await AsyncStorage.setItem('token', response.data.token);

                    Keyboard.dismiss();
                    this.login({username: loginDetails.username, password: loginDetails.password});
                }
                else{
                    alert("Failed to register successfully!");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else if(this.props.type === 'Login')
        {
            console.log(loginDetails);
            axios.post(`${API_URL}/token-auth/`,
            {username: loginDetails.username, password: loginDetails.password},
            {headers: {
                'Content-Type': 'application/json'
            }},
            )
            .then(async (response) => {
                if(response.data.token){
                    console.log("Successfully Saved!");
                    await AsyncStorage.setItem('token', response.data.token);

                    Keyboard.dismiss();
                    this.login({username: loginDetails.username, password: loginDetails.password});
                }
                else{
                    alert("Invalid Password/Username!");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            // try{
            //     let loginDetails = await AsyncStorage.getItem('loginDetails');
            //     let ld = JSON.parse(loginDetails);

            //     if (ld.email != null && ld.password != null)
            //     {
            //         if (ld.email == email && ld.password == password)
            //         {
            //             alert('Go in!');
            //             this.login();
            //         }
            //         else
            //         {
            //             alert('Email and Password does not exist!');
            //         }
            //     }

            // }catch(error)
            // {
            //     alert(error);
            // }
        }
    }

    showData = async()=>{
        let loginDetails = await AsyncStorage.getItem('loginDetails');
        let ld = JSON.parse(loginDetails);
        alert('email: '+ ld.email + ' ' + 'password: ' + ld.password);
    }

    render() {
        return(
            <View style={styles.container}>
                
                <TextInput style={styles.inputBox}
                onChangeText={(username) => this.setState({username})}
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Username"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="default"
                onSubmitEditing={()=> this.password.focus()}/>

                {this.props.type === "Signup"?(
                    
                    <TextInput style={styles.inputBox}
                    onChangeText={(email) => this.setState({email})}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Email"
                    placeholderTextColor = "#002f6c"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}/>
                ):(<Text></Text>)}
                
                
                <TextInput style={styles.inputBox}
                onChangeText={(password) => this.setState({password})} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"
                ref={(input) => this.password = input}
                />

                <TouchableOpacity style={styles.button}> 
                    <Text style={styles.buttonText} onPress={this.saveData}>{this.props.type}</Text>
                </TouchableOpacity>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: 300,
        height: 35,
        backgroundColor: '#eeeeee', 
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#1DB954',
        borderRadius: 25,
        marginVertical: 20,
        paddingVertical: 18
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }
});