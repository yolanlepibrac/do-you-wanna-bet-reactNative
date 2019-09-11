import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux'
import Store from './Redux/Store/index'

import MyAppComponent from './Components/MyAppComponent'

export default function App() {
  return (
    <View style={styles.container}>
      <Provider store={Store}>
        <MyAppComponent/>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
