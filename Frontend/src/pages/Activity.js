import React, { Component }  from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Platform,
  AsyncStorage
} from 'react-native';
import { withNavigation } from 'react-navigation';
import AwesomeButton from "react-native-really-awesome-button";
import {Actions} from 'react-native-router-flux';


function Separator() {
  return <View style={styles.separator} />;
}


APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

class Activity extends Component{ 
  static navigationOptions = {
    headerTitle: "Activity" , 
    headerStyle: {
      backgroundColor: '#000000',
      height: APPBAR_HEIGHT,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
      alignSelf: 'center',
    },
  };

render () {
  return (
    <ScrollView
        style={styles.container}>
      <View style={{backgroundColor: '#000000', alignItems: 'center'}}>
      <Text style={styles.title2}>
          PLEASE CHOOSE FROM ONE OF THE FOUR ACTIVITIES </Text>
      <AwesomeButton
      progress
      backgroundColor	= '#3B27BA'
      width = {350}

      onPress={next => {
        next();
        Actions.buddy({username: this.props.username});
        
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> BUDDY </Text>  
    </AwesomeButton>
        <Text style={styles.title}>
          A Smart Companion to talk about your problems! <Text onPress={BuddyhandleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
        </Text>
      </View>
      <Separator />
      <View style={{backgroundColor: '#000000', alignItems: 'center'}}>
      <AwesomeButton
      progress
      backgroundColor	= '#E847AE'
      width = {350}
      onPress={next => {
        next();
        Actions.Breathe({username: this.props.username})
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> BREATHE </Text>  
    </AwesomeButton>
        <Text style={styles.title}>
        Rhythmic breathing to relax your nerves! <Text onPress={BreathehandleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
        </Text>
      </View>
      {/* <Separator />
      <View style={{backgroundColor: '#000000' , alignItems: 'center'}}>
      <AwesomeButton
      progress
      backgroundColor	= '#13CA91'
      width = {350}
      onPress={next => {
        next();
        Actions.Yoga()
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> YOGA </Text>  
    </AwesomeButton>
        <Text style={styles.title}>
          Follow these Yoga Asanas to create a calmer, happier and more relaxed you! <Text onPress={YogahandleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
        </Text>
      </View> */}
      <Separator />
      <View style={{backgroundColor: '#000000' , alignItems: 'center'}}>
      <AwesomeButton
      progress
      backgroundColor	= '#FF9472'
      width = {350}
      onPress={next => {
        next();
        Actions.Jogging({username: this.props.username})
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> JOG </Text>  
    </AwesomeButton>
        <Text style={styles.title}>
          Jog while you listen to your favourite songs! <Text onPress={JoghandleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
        </Text>
      </View>
      <Separator />
      <View style={{backgroundColor: '#000000' , alignItems: 'center'}}>
      <AwesomeButton
      progress
      backgroundColor	= '#FEC763'
      width = {350}
      onPress={next => {
        next();
        Actions.Doodle({username: this.props.username})
      }}
    >
    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> DOODLE </Text>  
    </AwesomeButton>
        <Text style={styles.title}>
          Give your brain a break by doodling your emotions! <Text onPress={DoodlehandleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
        </Text>
      </View>
      <Separator />
      <View style={{backgroundColor: '#000000' , alignItems: 'center'}}>
        <AwesomeButton
        progress
        backgroundColor	= '#ff0000'
        width = {350}
        onPress={async next => {
          next();
          await AsyncStorage.removeItem('token');
          Actions.login();
        }}
        >
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}> Logout </Text>  
        </AwesomeButton>
        </View>
      <Separator />
    </ScrollView>
  );
} }


function YogahandleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://www.health.harvard.edu/mind-and-mood/yoga-for-anxiety-and-depression/'
  );
}

function BuddyhandleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://www.health.harvard.edu/healthbeat/writing-about-emotions-may-ease-stress-and-trauma/'
  );
}

function DoodlehandleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://www.health.harvard.edu/blog/the-thinking-benefits-of-doodling-2016121510844/'
  );
}

function BreathehandleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://www.health.harvard.edu/newsletter_article/Breath_control_helps_quell_errant_stress_response/'
  );
}

function JoghandleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://www.health.harvard.edu/press_releases/benefits-of-exercisereduces-stress-anxiety-and-helps-fight-depression/'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    color: '#000000',
  },
  title2: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginVertical: 8,
    fontSize: 20,
  },
  title: {
    textAlign: 'center',
    color: '#7a757c',
    justifyContent: 'center',
    marginVertical: 8,
    fontSize: 20,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  helpLinkText: {
    fontSize: 20,
    color: '#2e78b7',
  },
});

export default withNavigation(Activity);
