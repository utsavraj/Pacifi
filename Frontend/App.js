import React from 'react';
import { StyleSheet,
         Text, 
         View,
         StatusBar 
        } from 'react-native';

import Routes from './src/Router';
import axios from 'react-native-axios';

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar
          backgroundColor="#002f6c" 
          barStyle="light-content"
        />
        <Routes/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
