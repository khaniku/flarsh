import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Button} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Map from './dashboard';
import DrawerContent from '../components/sidebar'
import LoginScreen from "./auth/login";
import Signup from "./auth/signup";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import bookmark from './bookmark';
import business from './business';
import Profile from './profile';
import Payment from './payment';
import Preference from './preference';
import {
    useTheme
  } from 'react-native-paper';
import { useSelector, useDispatch } from "react-redux";
import { validateRefreshToken, getNewToken } from "../actions/api";
import { newToken } from "../actions";
import Moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Login() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{
          animationTypeForReplace: 'pop',
          headerShown: false
        }}
        component={LoginScreen} />
      <Stack.Screen name="Signup" options={{
        headerShown: false,
        }}
        component={Signup} 
      />
    </Stack.Navigator>
  );
}

function mainStack() {
    return(
        <Stack.Navigator
        screenOptions={{
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}
          mode="modal"
        >
        <Stack.Screen name="Map" options={{
            headerShown: false
            }}
            component={Map} />
        <Stack.Screen name="bookmark" options={{
            headerShown: false,
            }}
            component={bookmark} />
        <Stack.Screen name="business" options={{
            headerShown: false,
            }}
            component={business} />
        <Stack.Screen name="profile" options={{
            headerShown: false
            }}
            component={Profile} />
        <Stack.Screen name="payment" options={{
            headerShown: false
            }}
            component={Payment} />
        <Stack.Screen name="preference" options={{
            headerShown: false
            }}
            component={Preference} />
        </Stack.Navigator>
    )
}

function mainDrawer() {
  const paperTheme = useTheme();
  const user = useSelector(state => state.user.userDetails);
  return (
    <Drawer.Navigator drawerContent={props => DrawerContent(props, user)}>
        <Drawer.Screen name="Home" options={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }} component={mainStack} />
    </Drawer.Navigator>
  )
}

async function registerForPushNotificationsAsync() {

  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    console.log('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
}

export default function App({navigation}) { 
  const refreshToken = useSelector(state => state.user.refreshToken);
  const time = useSelector(state => state.user)
  const expirationTime = useSelector(state => state.user.expirationTime);
  const apiKey = useSelector(state => state.user.apiKey);
  const dispatch = useDispatch();

  const updateToken =  () => {
    validateRefreshToken(refreshToken).then(function (data) {
      if(data){
        dispatch(newToken(refreshToken, apiKey))
      }
    })     
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
    if(Moment().isAfter(expirationTime))
      updateToken();
    
      const unsubscribe = navigation.addListener('focus', () => {
        console.log("test")
      });
  
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
  }, [navigation])
  
  return (
    <Stack.Navigator>
       <Stack.Screen options={{ headerShown: false}}  name="Home" component={mainDrawer} />
       <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  DrawersContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  DrawersSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});