import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, Platform } from 'react-native';

const APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 44,
  default: 64,
});

export default class Yoga extends Component {
  static navigationOptions = {
    headerTitle: "Yoga" , 
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
  render() {
  return (
    <ScrollView style={styles.container}>
      <Text>YOGA </Text>
    </ScrollView>
  );
} }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
