import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Button} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Payment from './payments';
import Card from './card';
import OneCard from './oneCard';

const Stack = createStackNavigator();

export default function App() {     
    return (
      <Stack.Navigator>
         <Stack.Screen options={{ headerShown: false}}  name="Payment" component={Payment} />
         <Stack.Screen name="Card" options={{headerShown: false}} component={Card} />
         <Stack.Screen name="oneCard" options={{headerShown: false}} component={OneCard} />
      </Stack.Navigator>
    );
  }
