import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Button} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Preference from './preference';
import About from './about';
import Agreement from './agreement';
import Privacy from './privacy';

const Stack = createStackNavigator();

export default function App() {     
    return (
      <Stack.Navigator>
         <Stack.Screen options={{ headerShown: false}}  name="Preference" component={Preference} />
         <Stack.Screen name="About" options={{headerShown: false}} component={About} />
         <Stack.Screen name="Agreement" options={{headerShown: false}} component={Agreement} />
         <Stack.Screen name="Privacy" options={{headerShown: false}} component={Privacy} />
      </Stack.Navigator>
    );
  }
