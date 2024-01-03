import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AppDetails from './src/details';
import HomePage from './src/homepage';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName='Home'>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Details" component={AppDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
